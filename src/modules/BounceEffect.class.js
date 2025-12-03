/**
 * Bounce effect applier on inner element
 */
export class BounceEffect {
  /**
   * Container for animation
   * @type {HTMLElement}
   */
  #container;

  /**
   * Inner animation element
   * @type {HTMLElement}
   */
  #innerElement;

  /**
   * Number of bounces for effect
   * @type {number}
   */
  #bounces;

  /**
   * Duration of effect in ms
   * @type {number}
   */
  #duration;

  /**
   * Animation frame
   * @type {number|null}
   */
  #animationFrame = null;

  /**
   * Start time
   * @type {DOMHighResTimeStamp|null}
   */
  #startTime = null;

  // Extracted constants for readability and reuse
  static #MAX_AMPLITUDE = 20;
  static #RESET_TRANSFORM = 'translateX(0)';

  /**
   * Constructor
   *
   * @param {HTMLElement} element - container element
   * @param {HTMLElement} innerElement - target element of animation
   * @param {number} bounces - number of bounces
   * @param {number} duration - total duration of animation
   */
  constructor(element, innerElement, bounces = 10, duration = 2000) {
    if (!element || !innerElement) {
      throw new Error('Animation elements are not defined properly');
    }

    this.#container = element;
    this.#innerElement = innerElement;

    this.#bounces = bounces;
    this.#duration = duration;

    this.#container.addEventListener('mouseenter', this.#handleMouseEnter);
    this.#container.addEventListener('click', this.#handleClick);
  }

  /**
   * Handle mouse enter event (arrow to keep lexical this)
   * NB:
   * Arrow functions in JavaScript do not bind their own this value.
   * Instead, they lexically capture this value
   * from their surrounding scope at the time of their creation.
   */
  #handleMouseEnter = () => {
    this.#cancelAnimation();
    this.#startTime = performance.now();
    this.#animationFrame = requestAnimationFrame(this.#animate);
  };

  /**
   * Animate method
   * @param {DOMHighResTimeStamp} now
   */
  #animate = (now) => {
    if (this.#startTime == null) {
      return;
    }

    const elapsed = now - this.#startTime;
    const progress = Math.min(elapsed / this.#duration, 1);

    const amplitude = (1 - progress) * BounceEffect.#MAX_AMPLITUDE;
    const angle = progress * this.#bounces * Math.PI * 2;
    const x = Math.sin(angle) * amplitude;

    this.#innerElement.style.transform = `translateX(${x}px)`;

    if (progress < 1) {
      this.#animationFrame = requestAnimationFrame(this.#animate);
    } else {
      this.#innerElement.style.transform = BounceEffect.#RESET_TRANSFORM;
      this.#animationFrame = null;
    }
  };

  /**
   * Handle mouse click event (arrow to keep lexical this)
   */
  #handleClick = () => {
    this.#cancelAnimation();
    this.#innerElement.style.transform = BounceEffect.#RESET_TRANSFORM;
  };

  #cancelAnimation() {
    if (this.#animationFrame != null) {
      cancelAnimationFrame(this.#animationFrame);
      this.#animationFrame = null;
    }
  }
}
