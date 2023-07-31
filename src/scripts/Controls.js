'use strict';

class Controls {
  constructor(onLeft, onRight, onUp, onDown, onAction) {
    this.enabled = false;
    this.onLeft = onLeft;
    this.onRight = onRight;
    this.onUp = onUp;
    this.onDown = onDown;
    this.onAction = onAction;

    this.KEYS = {
      LEFT: 'ArrowLeft',
      RIGHT: 'ArrowRight',
      UP: 'ArrowUp',
      DOWN: 'ArrowDown',
    };

    document.addEventListener('keydown', (keyboardEvent) => {
      if (!this.enabled) {
        return;
      }

      switch (keyboardEvent.key) {
        case this.KEYS.LEFT:
          this.onLeft();
          break;
        case this.KEYS.RIGHT:
          this.onRight();
          break;
        case this.KEYS.UP:
          this.onUp();
          break;
        case this.KEYS.DOWN:
          this.onDown();
          break;
        default:
          break;
      }

      if (Object.values(this.KEYS).includes(keyboardEvent.key)) {
        this.onAction();
      }
    });
  }
}

module.exports = Controls;
