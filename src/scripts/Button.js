'use strict';

class Button {
  constructor(element, startFunc, restartFunc) {
    const START_TEXT = 'Start';
    const START_CLASS = 'start';
    const RESTART_TEXT = 'Restart';
    const RESTART_CLASS = 'restart';

    this.element = element;

    this.element.addEventListener('click', () => {
      if (this.element.classList.contains(START_CLASS)) {
        startFunc();
        this.element.classList.remove(START_CLASS);
        this.element.classList.add(RESTART_CLASS);
        this.element.textContent = RESTART_TEXT;
      } else if (this.element.classList.contains(RESTART_CLASS)) {
        restartFunc();
        this.element.classList.remove(RESTART_CLASS);
        this.element.classList.add(START_CLASS);
        this.element.textContent = START_TEXT;
      }
    });
  }
}

module.exports = Button;
