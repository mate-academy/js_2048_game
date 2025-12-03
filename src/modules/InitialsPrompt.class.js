'use strict';

import { Sound } from './Sound.class';

/**
 * Class for enter initials for high score
 */
export class InitialsPrompt {
  /**
   * Constructor
   * @param onSubmit - cb when prompts are entered
   */
  constructor({ onSubmit }) {
    this.letters = ['A', 'A', 'A'];
    this.currentIndex = 0;
    this.onSubmit = onSubmit;
    this.#render();
    this.#bindEvents();
  }

  /**
   * Renders the popup for the hiscore name
   */
  #render() {
    // One-time style injection for triangles and weak blink
    if (!document.getElementById('initials-prompt-style')) {
      const style = document.createElement('style');

      style.id = 'initials-prompt-style';

      style.textContent = `

      `;
      document.head.appendChild(style);
    }

    this.backdrop = document.createElement('div');
    this.backdrop.className = 'initials-backdrop';

    // prettier-ignore
    this.backdrop.innerHTML = String.raw`
      <div class="initials-popup">
        <div class="initials-popup-container">
          <div>ENTER YOUR NAME</div>
          <div class="initials-controls">
            <button class="tri-btn tri-left tri-side" type="button"
            data-action="prev" aria-label="Previous position"></button>
            <div class="initials-letters" role="group"
            aria-label="Initials editor">
              ${this.letters
    .map(
      (l, i) => `
                <div class="letter-wrap" data-index="${i}">
                  <button class="tri-btn tri-up" type="button"
                    data-action="inc" data-index="${i}"
                    aria-label="Next letter">
                  </button>
                  <div class="letter ${i === 0 ? 'is-active' : ''}"
                    role="button" aria-pressed="${i === 0}"
                    aria-label="Letter ${i + 1}">
                    ${l}
                  </div>
                  <button class="tri-btn tri-down" type="button"
                    data-action="dec" data-index="${i}"
                    aria-label="Previous letter">
                  </button>
                </div>
              `,
    )
    .join('')}
            </div>
            <button class="tri-btn tri-right tri-side" type="button"
              data-action="next" aria-label="Next position">
            </button>
          </div>
          <button class="enter-btn" type="button" data-action="submit">
            ✔ ENTER
          </button>
        </div>
      </div>`;

    this.container = document.createElement('div');
    this.container.className = 'initials-container';
    this.container.appendChild(this.backdrop);
    document.body.appendChild(this.container);

    // Cache elements
    this.letterEls = Array.from(
      this.backdrop.querySelectorAll('.initials-letters .letter'),
    );

    // Autofocus on the first letter
    this.letterEls[0].tabIndex = 0;
    this.letterEls[0].focus();

    this.enterBtn = this.backdrop.querySelector('.enter-btn');

    this.enterBtn.addEventListener('click', () => {
      this.handleSubmit();
    });
  }

  /**
   * Binds events for change letters
   */
  #bindEvents() {
    // Keyboard controls
    this.keyHandler = (e) => {
      if (e.key === 'ArrowRight') {
        this.currentIndex = (this.currentIndex + 1) % this.letters.length;
        this.#updateActive();
        Sound.beep(600);
      }

      if (e.key === 'ArrowLeft') {
        this.currentIndex =
          (this.currentIndex + this.letters.length - 1) % this.letters.length;
        this.#updateActive();
        Sound.beep(500);
      }

      if (e.key === 'ArrowUp') {
        this.#changeLetterAt(this.currentIndex, 1);
        Sound.beep(700);
      }

      if (e.key === 'ArrowDown') {
        this.#changeLetterAt(this.currentIndex, -1);
        Sound.beep(400);
      }

      if (e.key === 'Enter') {
        this.#submit();
      }

      if (e.key === 'Escape') {
        this.#cancel();
      }
    };
    window.addEventListener('keydown', this.keyHandler, { passive: true });

    // Click/tap controls via event delegation on a backdrop
    this.clickHandler = (e) => {
      const btn = e.target.closest('[data-action]');

      if (!btn) {
        return;
      }

      const action = btn.getAttribute('data-action');

      // init letter only in case when a button is close to a letter
      let letter = null;

      // Set currentIndex only for buttons that modify letter
      // For prev and next button - just change the current index
      if (action === 'inc' || action === 'dec') {
        this.currentIndex = Number(btn.getAttribute('data-index'));
        letter = btn.parentElement.querySelector('.letter');
        // set focus on a letter that we're changing
        letter.focus();
      }

      switch (action) {
        case 'prev': {
          // just change the current index
          this.currentIndex =
            (this.currentIndex + this.letters.length - 1) % this.letters.length;
          this.#updateActive();
          Sound.beep(500);
          // focus on the new active letter
          this.letterEls[this.currentIndex].focus();
          break;
        }

        case 'next': {
          // just change the current index
          this.currentIndex = (this.currentIndex + 1) % this.letters.length;
          this.#updateActive();
          Sound.beep(600);
          // focus on the new active letter
          this.letterEls[this.currentIndex].focus();
          break;
        }

        case 'inc': {
          this.#changeLetterAt(this.currentIndex, 1);
          this.#updateActive();
          Sound.beep(700);
          // focus on the new active letter
          this.letterEls[this.currentIndex].focus();
          break;
        }

        case 'dec': {
          this.#changeLetterAt(this.currentIndex, -1);
          this.#updateActive();
          Sound.beep(400);
          // focus on the new active letter
          this.letterEls[this.currentIndex].focus();
          break;
        }
        default:
          break;
      }
    };
    this.backdrop.addEventListener('click', this.clickHandler);
  }

  /**
   * Change a letter at a specific index by delta (+1/-1), update DOM
   * @param index
   * @param delta
   */
  #changeLetterAt(index, delta) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const current = this.letters[index] || 'A';
    const pos = alphabet.indexOf(current.toUpperCase());
    const nextPos = (pos + delta + alphabet.length) % alphabet.length;
    const nextChar = alphabet[nextPos];

    this.letters[index] = nextChar;

    const el = this.letterEls[index];

    if (el) {
      el.textContent = nextChar;
    }
  }

  /**
   * Visually update active letter and blinking state
   */
  #updateActive() {
    this.letterEls.forEach((el, i) => {
      el.classList.toggle('is-active', i === this.currentIndex);
      el.setAttribute('aria-pressed', String(i === this.currentIndex));
    });
  }

  /**
   * Submit name and clean up
   */
  #submit() {
    const value = this.letters.join('');

    if (typeof this.onSubmit === 'function') {
      this.onSubmit(value);
    }
    this.#dispose();
  }

  /**
   * close popup
   */
  #cancel() {
    this.#dispose();
  }

  /**
   * removes event handlers
   */
  #dispose() {
    window.removeEventListener('keydown', this.keyHandler);
    this.backdrop.removeEventListener('click', this.clickHandler);

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  /**
   * Handle submission of entered name
   */
  handleSubmit() {
    const passedName = this.letterEls
      .map((el) => el.textContent.trim())
      .join('');

    this.#dispose();

    this.onSubmit(passedName);
  }
}
