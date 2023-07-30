'use strict';

class Controls {
  constructor(onLeft, onRight, onUp, onDown, onAction) {
    this.enabled = false;
    this.onLeft = onLeft;
    this.onRight = onRight;
    this.onUp = onUp;
    this.onDown = onDown;
    this.onAction = onAction;

    document.addEventListener('keydown', (keyboardEvent) => {
      if (!this.enabled) {
        return;
      }

      switch (keyboardEvent.key) {
        case 'ArrowLeft':
          this.onLeft();
          break;
        case 'ArrowRight':
          this.onRight();
          break;
        case 'ArrowUp':
          this.onUp();
          break;
        case 'ArrowDown':
          this.onDown();
          break;
        default:
          break;
      }

      this.onAction();
    });
  }
}

module.exports = Controls;
