'use strict';

/**
 * Container for callback actions
 */
export class CbContainer {
  /**
   * Control callback for the left action
   * @type {function}
   * @private
   */
  left;

  /**
   * Control callback for the right action
   * @type {function}
   * @private
   */
  right;

  /**
   * Control callback for the up action
   * @type {function}
   * @private
   */
  up;

  /**
   * Control callback for the down action
   * @type {function}
   * @private
   */
  down;

  /**
   * Constructor
   * @param callbacks
   */
  constructor(callbacks = {}) {
    this.left = callbacks.left ?? null;
    this.right = callbacks.right ?? null;
    this.up = callbacks.up ?? null;
    this.down = callbacks.down ?? null;
  }
}

/**
 * This class supports simple control actions:
 * - mouse/touch/pointer swipe on board
 */
export class Control {
  /**
   * Minimal distance in px to activate swipe
   * @type {number}
   * @private
   */
  static #minDistance = 30;

  /** @type {number} */
  #startX = 0;
  /** @type {number} */
  #startY = 0;
  /** @type {boolean} */
  #isPointerDown = false;
  /** @type {boolean} */
  #swipeFired = false;

  /** @type {HTMLElement} */
  #board;
  /** @type {CbContainer} */
  #callbacks;

  /**
   * Constructor
   *
   * @param boardContainer
   * @param callbackContainer
   */
  constructor(boardContainer, callbackContainer = new CbContainer()) {
    if (!(boardContainer instanceof HTMLElement)) {
      throw new Error('Control: boardContainer must be an HTMLElement');
    }

    this.#board = boardContainer;
    this.#callbacks = callbackContainer;

    // Use Pointer Events for unified handling
    this.#board.addEventListener('pointerdown', this.#onPointerDown);
  }

  /**
   * Process action on pointer down
   * @param {PointerEvent} e
   * @private
   */
  #onPointerDown(e) {
    // Ignore non-left mouse button
    if (e.pointerType === 'mouse' && e.button !== 0) {
      return;
    }

    this.#isPointerDown = true;
    this.#swipeFired = false;
    this.#startX = e.clientX;
    this.#startY = e.clientY;

    // Capture the pointer to keep receiving events outside the element
    if (this.#board.setPointerCapture) {
      try {
        this.#board.setPointerCapture(e.pointerId);
      } catch {
        // no-op if capture isn't available,
        // production mode, "something goes wrong"?
      }
    }

    // Attach move/up handlers for the duration of the gesture
    this.#board.addEventListener('pointermove', this.#onPointerMove);
    this.#board.addEventListener('pointerup', this.#onPointerUpOrCancel);
    this.#board.addEventListener('pointercancel', this.#onPointerUpOrCancel);
  }

  /**
   * Process action on pointer move
   * @param {PointerEvent} e
   * @private
   */
  #onPointerMove(e) {
    if (!this.#isPointerDown || this.#swipeFired) {
      return;
    }

    const dx = e.clientX - this.#startX;
    const dy = e.clientY - this.#startY;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);

    // Wait until the threshold is exceeded
    if (Math.max(adx, ady) < Control.#minDistance) {
      return;
    }

    // Decide axis by the larger delta and fire exactly one callback
    if (adx > ady) {
      if (dx > 0) {
        if (this.#callbacks.right) {
          this.#callbacks.right();
        }
      } else {
        if (this.#callbacks.left) {
          this.#callbacks.left();
        }
      }
    } else {
      if (dy > 0) {
        if (this.#callbacks.down) {
          this.#callbacks.down();
        }
      } else {
        if (this.#callbacks.up) {
          this.#callbacks.up();
        }
      }
    }

    this.#swipeFired = true;
  }

  /**
   * Process action on pointer up or cancel
   * @param {PointerEvent} e
   * @private
   */
  #onPointerUpOrCancel(e) {
    this.#isPointerDown = false;
    this.#swipeFired = false;

    if (this.#board.releasePointerCapture) {
      try {
        this.#board.releasePointerCapture(e.pointerId);
      } catch {
        // no-op, production mode, "something goes wrong"?
      }
    }

    this.#board.removeEventListener('pointermove', this.#onPointerMove);
    this.#board.removeEventListener('pointerup', this.#onPointerUpOrCancel);
    this.#board.removeEventListener('pointercancel', this.#onPointerUpOrCancel);
  }
}
