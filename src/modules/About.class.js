'use strict';

import { Modal } from './Modal.class';

export class About extends Modal {
  /**
   * About effect
   * @type {string}
   * @private
   */
  static #rippleEasing = 'cubic-bezier(0.1, 0.7, 1, 0.1)';

  /**
   * About effect delay step
   * @type {number}
   * @private
   */
  static #rippleDelayStep = 0.2;

  /**
   * About effects waves count
   * @type {number}
   * @private
   */
  static #wavesCount = 5;

  /**
   * Initializes CTA
   *
   * @private
   */
  _init() {
    // Apply effects
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < About.#wavesCount; i++) {
      fragment.appendChild(this._createRipple(i));
    }

    this._ctaElement.appendChild(fragment);

    super._init();
  }

  /**
   * Creates a single ripple element
   * @param {number} index
   * @returns {HTMLSpanElement}
   * @private
   */
  _createRipple(index) {
    const ripple = document.createElement('span');

    ripple.className = 'ripple';
    ripple.style.transitionTimingFunction = About.#rippleEasing;
    ripple.style.animationDelay = `${index * About.#rippleDelayStep}s`;

    return ripple;
  }
}
