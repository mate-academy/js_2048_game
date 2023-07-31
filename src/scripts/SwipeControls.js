'use strict';

const Controls = require('./Controls');

class SwipeControls extends Controls {
  constructor(onLeft, onRight, onUp, onDown, onAction) {
    super(onLeft, onRight, onUp, onDown, onAction);

    let touchStartX, touchStartY;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Minimum threshold for a valid horizontal swipe
        if (Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            this.onRight();
          } else {
            this.onLeft();
          }
          this.onAction();
        }
      } else {
        // Minimum threshold for a valid vertical swipe
        if (Math.abs(deltaY) > 50) {
          if (deltaY > 0) {
            this.onDown();
          } else {
            this.onUp();
          }
          this.onAction();
        }
      }
    });
  }
}

module.exports = SwipeControls;
