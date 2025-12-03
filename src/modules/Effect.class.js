'use strict';

import { Palette } from './Palette.class.js';

/**
 * Effect for a number container:
 * - frame-by-frame "shaking" for each character (translate X/Y and rotate)
 * - smooth color transitions across the palette: container background and text
 *
 * Important: the palette must be in the following format:
 * palette = [
 * { background: '#rrggbb' | 'colorName', text: '#rrggbb' | 'colorName' },
 * ...
 * ]
 * Support for any other formats is intentional.
 */
export class Effect {
  /**
   * All modal windows
   * @type {TileColor[]}
   * @private
   */
  #palette;

  /**
   * Palette index
   * @type {number}
   * @private
   */
  #palIdx;

  /**
   * Configuration
   * @type {Object}
   * @private
   */
  #cfg;

  /**
   * Span children of container
   * @type {HTMLSpanElement[]}
   * @private
   */
  #spans;

  /**
   * Timer uuid
   * @type {number}
   * @private
   */
  #timerId;

  /**
   * Last color switch timestamp
   * @type {DOMHighResTimeStamp}
   * @private
   */
  #lastColorSwitchTs;

  /**
   * Jitter states
   * @type {WeakMap}
   */
  #jitterStates;

  /**
   * Jitter request animation fream handler
   * @type {number}
   */
  #jitterRaf;

  /**
   * Root container
   * @private {HTMLElement}
   */
  _root;

  /**
   * Constructor
   * @param {HTMLElement} root container for animation with some text
   * @result Effect
   */
  constructor(root) {
    if (!(root instanceof HTMLElement)) {
      return;
    }
    this._root = root;

    return this;
  }

  /**
   * Apply effect
   *
   * @param {Object} [options]
   * @param {number} [options.strengthJitter] shaking amplitude for O(x) (px)
   * @param {number} [options.strengthJitterY] shaking amplitude for O(y) (px)
   *  by default - options.strengthJitter - the same as for O(x)
   * @param {number} [options.strengthRotate] rotation amplitude (deg)
   * @param {number} [options.interval] general refresh interval
   * @param {number} [options.colorDuration] timing for smooth color change
   * @param {TileColor[]} - color palette for tiles
   */
  apply({
    strengthJitter = 7,
    strengthJitterY = 14,
    strengthRotate = 5,
    interval = 2000,
    colorDuration = 5000,
    palette = Palette.tilePalette,
  } = {}) {
    this.#cfg = {
      strengthJitter,
      strengthJitterY: strengthJitterY ?? strengthJitter,
      strengthRotate,
      interval,
      colorDuration,
    };

    // validate and apply palette
    this.#palette = this._validatePalette(palette) ? palette.slice() : [];
    this.#palIdx = 0;

    // Define the state of elements and timer
    this.#spans = [];
    this.#timerId = null;
    this.#lastColorSwitchTs = 0;

    // Prepare DOM: wrap symbols for individual effects
    this._wrapTextNodes();

    this.#jitterStates = new WeakMap();
    this.#jitterRaf = null;
    // Prepare initial state
    this._initJitterState();
    // Start with smooth twining
    this._rafJitter();

    // Set up the CSS transition for a smooth color change
    this._setupColorTransitions();

    // Set up the initial color if we have a palette without animation
    if (this.#palette.length > 0) {
      this._applyNextPaletteColor(true);
      this.#lastColorSwitchTs = performance.now();
    }

    // Start a global timer
    this.start();
  }

  /**
   * Change palette on the fly
   * Strict format: Array<{ background: string, text: string }>
   * Start animation from start to new color
   * @param {Array<{background: string, text: string}>} palette
   */
  setPalette(palette) {
    if (!this._validatePalette(palette)) {
      return;
    }

    this.#palette = palette.slice();
    this.#palIdx = 0;

    // Set new palette color for animation
    // Got smooth change because of transition
    this._applyNextPaletteColor(false);
    this.#lastColorSwitchTs = performance.now();
  }

  /**
   * Start refresh is it is not in progress yet
   */
  start() {
    if (this.#timerId) {
      return;
    }

    const { interval, colorDuration } = this.#cfg;

    this.#timerId = setInterval(() => {
      const now = performance.now();

      // 1) jitter effect for each symbol
      this._tickJitter();

      // 2) change color by palette
      if (
        this.#palette.length > 0 &&
        now - this.#lastColorSwitchTs >= colorDuration
      ) {
        this._applyNextPaletteColor(false);
        this.#lastColorSwitchTs = now;
      }
    }, interval);
  }

  /**
   * Stop refresh
   */
  stop() {
    if (this.#jitterRaf !== 0) {
      cancelAnimationFrame(this.#jitterRaf);
      this.#jitterRaf = 0;
    }

    if (this.#timerId) {
      clearInterval(this.#timerId);
      this.#timerId = 0;
    }
  }

  /**
   * Destroy and full clean-up
   */
  destroy() {
    this.stop();
  }

  /**
   * Validate the palette
   * @param palette
   * @return {false|*}
   * @private
   */
  _validatePalette(palette) {
    return (
      Array.isArray(palette) &&
      palette.length > 0 &&
      palette.every(
        (paletteElm) =>
          paletteElm &&
          typeof paletteElm === 'object' &&
          typeof paletteElm.background === 'string' &&
          typeof paletteElm.text === 'string',
      )
    );
  }

  /**
   * Set up smooth color transitions
   * @private
   */
  _setupColorTransitions() {
    const { colorDuration } = this.#cfg;

    // Smooth color transition for background and text
    const transitionRoot = [
      `background-color ${colorDuration}ms linear`,
      `color ${colorDuration}ms linear`,
    ].join(', ');

    this._root.style.transition = transitionRoot;

    // Smooth color transition for each symbol
    for (const span of this.#spans) {
      span.style.transition = `color ${colorDuration}ms linear`;
    }
  }

  /**
   * Apply the next palette color
   * @param initial
   * @private
   */
  _applyNextPaletteColor(initial = false) {
    if (this.#palette.length === 0) {
      return;
    }

    const idx = this.#palIdx % this.#palette.length;
    const { background, text } = this.#palette[idx];

    if (initial) {
      const prevRootTransition = this._root.style.transition;
      const prevSpanTransitions = this.#spans.map((s) => s.style.transition);

      this._root.style.transition = 'none';

      for (const s of this.#spans) {
        s.style.transition = 'none';
      }

      this._root.style.backgroundColor = background;
      this._root.style.color = text;

      // Define span color instead of container - in relation to extendability
      for (const s of this.#spans) {
        s.style.color = text;
      }

      // Force reflow, trigger the browser to apply changes
      // and recalculate the layout
      void this._root.offsetHeight;

      // restore transitions
      this._root.style.transition = prevRootTransition;

      this.#spans.forEach(
        (s, i) => (s.style.transition = prevSpanTransitions[i]),
      );
    } else {
      // Smoothly to the next color
      this._root.style.backgroundColor = background;
      this._root.style.color = text;

      for (const s of this.#spans) {
        s.style.color = text;
      }
    }

    this.#palIdx += 1;
  }

  /**
   * Wrap symbols to span
   * @return {1|2}
   * @private
   */
  _wrapTextNodes() {
    const walker = document.createTreeWalker(this._root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        // skip empty/space nodes
        return /\S/.test(node.nodeValue)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });

    const textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    for (const textNode of textNodes) {
      const parentEl = textNode.parentElement;

      if (!parentEl) {
        continue;
      }

      const text = textNode.nodeValue;
      const frag = document.createDocumentFragment();

      for (let i = 0; i < text.length; i += 1) {
        const ch = text[i];

        if (/\s/.test(ch)) {
          // Save spaces/etc without a wrapper
          frag.appendChild(document.createTextNode(ch));
        } else {
          const span = document.createElement('span');

          span.className = 'digit-distorted';
          span.textContent = ch;
          frag.appendChild(span);
          this.#spans.push(span);
        }
      }

      parentEl.replaceChild(frag, textNode);
    }
  }

  /**
   * Animation
   * @private
   */
  _tickJitter() {
    const now = performance.now();

    // prettier-ignore
    const {
      strengthJitter,
      strengthJitterY,
      strengthRotate,
      interval,
    } = this.#cfg;

    for (const span of this.#spans) {
      const st = this.#jitterStates.get(span);

      if (!st) {
        continue;
      }

      // Calculate the current position at the moment of target recalculation
      const t = Math.min(1, (now - st.startedAt) / st.duration);
      const ease = t * t * (3 - 2 * t); // smoothstep
      const cur = {
        tx: st.from.tx + (st.to.tx - st.from.tx) * ease,
        ty: st.from.ty + (st.to.ty - st.from.ty) * ease,
        rot: st.from.rot + (st.to.rot - st.from.rot) * ease,
      };

      // Shift "from" to current value and define new "to"
      st.from = cur;

      st.to = {
        tx: (Math.random() * 2 - 1) * strengthJitter,
        ty: (Math.random() * 2 - 1) * strengthJitterY,
        rot: (Math.random() * 2 - 1) * strengthRotate,
      };
      st.startedAt = now;
      st.duration = interval;
    }
  }

  // Initialise the states for drift for every span
  _initJitterState() {
    const now = performance.now();
    // prettier-ignore
    const {
      strengthJitter,
      strengthJitterY,
      strengthRotate,
      interval,
    } = this.#cfg;

    for (const span of this.#spans) {
      const state = {
        from: { tx: 0, ty: 0, rot: 0 },
        to: {
          tx: (Math.random() * 2 - 1) * strengthJitter,
          ty: (Math.random() * 2 - 1) * strengthJitterY,
          rot: (Math.random() * 2 - 1) * strengthRotate,
        },
        startedAt: now,
        duration: interval,
      };

      this.#jitterStates.set(span, state);
    }
  }

  // Render of smooth shift
  _rafJitter() {
    const now = performance.now();

    for (const span of this.#spans) {
      const st = this.#jitterStates.get(span);

      if (!st) {
        continue;
      }

      const t = Math.min(1, (now - st.startedAt) / st.duration);
      const ease = t * t * (3 - 2 * t); // smoothstep

      const tx = st.from.tx + (st.to.tx - st.from.tx) * ease;
      const ty = st.from.ty + (st.to.ty - st.from.ty) * ease;
      const rot = st.from.rot + (st.to.rot - st.from.rot) * ease;

      span.style.setProperty(
        '--jitter-translate',
        `${tx.toFixed(2)}px, ${ty.toFixed(2)}px`,
      );

      span.style.setProperty('--jitter-rot', `${rot.toFixed(2)}deg`);
    }

    this.#jitterRaf = requestAnimationFrame(this._rafJitter.bind(this));
  }
}
