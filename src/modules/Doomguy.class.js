'use strict';

/**
 * This class supports doomguy fancy animation to freshen up the game
 */
export class Doomguy {
  static event = 'DOOM_GUY_UPDATE_EVENT';
  static #minHealth = 0;
  static #maxHealth = 100;

  /**
   * Doomguy DOM elements
   * @type {NodeListOf<Element>}
   * @private
   */
  #elements;

  /**
   * @param {NodeListOf<Element>} doomguyElements
   */
  constructor(doomguyElements) {
    if (!(doomguyElements instanceof NodeList)) {
      throw new Error('Doomguy elements must be a NodeList');
    }

    this.#elements = doomguyElements;

    // initialize health
    this.#elements.forEach((el) => {
      /**
       * @var el.dataset
       * @type {DOMStringMap}
       */
      el.dataset.health = Doomguy.#maxHealth.toString();
    });

    // listen for window event and update all elements in the listener
    window.addEventListener(Doomguy.event, (e) => {
      const health = e?.detail?.health;

      if (!Number.isInteger(health)) {
        return;
      }

      const normalizeHealth = Math.max(
        Doomguy.#minHealth,
        Math.min(Doomguy.#maxHealth, health),
      );

      this.#elements.forEach((el) => {
        el.dataset.health = String(normalizeHealth);
      });
    });
  }
}
