'use strict';

import { Sound } from './Sound.class';

export class Modal {
  /**
   * CTA element to control the modal window
   * @type {HTMLElement}
   * @protected
   */
  _ctaElement;

  /**
   * Modal window
   * @type {HTMLElement | null}
   * @private
   */
  _modalWindowElement;

  /**
   * All modal windows
   * @type {HTMLElement[]}
   * @private
   */
  _modalWindowElements;

  /**
   * Game content
   * @type {HTMLElement[]}
   * @private
   */
  _gameContent;

  /**
   * Constructor
   *
   * @param {HTMLElement} ctaElement - current CTA to show/hide modal
   * @param {HTMLElement} modalWindowElement - modal itself
   * @param {NodeListOf<HTMLElement>} modalWindowElements - list all modals
   * @param {NodeListOf<HTMLElement>} gameContentElements - list game elements
   */
  constructor(
    ctaElement,
    modalWindowElement,
    modalWindowElements,
    gameContentElements,
  ) {
    if (!(ctaElement instanceof HTMLElement)) {
      throw new Error('ctaElement must be an HTMLElement');
    }

    // menu
    this._ctaElement = ctaElement;

    if (!(modalWindowElement instanceof HTMLElement)) {
      throw new Error('modalWindowElement must be an HTMLElement');
    }

    // pop-up window
    this._modalWindowElement = modalWindowElement;

    // all pop-ups
    this._modalWindowElements =
      modalWindowElements instanceof HTMLElement
        ? [modalWindowElements]
        : Array.from(modalWindowElements || []);

    // Normalize to array, for use with forEach
    this._gameContent =
      gameContentElements instanceof HTMLElement
        ? [gameContentElements]
        : Array.from(gameContentElements || []);

    this._init();
  }

  /**
   * Initializes CTA
   *
   * @private
   */
  _init() {
    // Init popup window show CTA
    this._ctaElement.addEventListener('click', (e) => this._show(e));
  }

  /**
   * Show a modal window and hide other modals + game content
   * @private
   */
  _show(e) {
    this._gameContent.forEach((el) => el.classList.add('hidden'));

    Sound.stop();

    this._modalWindowElements.forEach((el) => {
      if (el === this._modalWindowElement) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
  }
}
