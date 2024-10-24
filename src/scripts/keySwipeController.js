import constants from './constants';

export const swipeController = {
  touch: {
    startX: 0,
    endX: 0,
    startY: 0,
    endY: 0,
  },

  handleTouchStart: function (e) {
    this.touch.startX = e.changedTouches[0].screenX;
    this.touch.startY = e.changedTouches[0].screenY;
  },

  handleTouchEnd: function (e) {
    this.touch.endX = e.changedTouches[0].screenX;
    this.touch.endY = e.changedTouches[0].screenY;

    return this.identifySwipeDirection();
  },

  identifySwipeDirection: function () {
    const diffX = this.touch.startX - this.touch.endX;
    const diffY = this.touch.startY - this.touch.endY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (diffX > 50) {
        return constants.DIRECTION.left;
      } else if (diffX < -50) {
        return constants.DIRECTION.right;
      }
    } else {
      // Vertical swipe
      if (diffY > 50) {
        return constants.DIRECTION.up;
      } else if (diffY < -50) {
        return constants.DIRECTION.down;
      }
    }
  },

  preventScrollOnSwipe: function (e) {
    e.preventDefault();
  },
};

export const keyController = {
  arrowKeys: {
    ArrowLeft: constants.DIRECTION.left,
    ArrowRight: constants.DIRECTION.right,
    ArrowUp: constants.DIRECTION.up,
    ArrowDown: constants.DIRECTION.down,
  },

  identifyArrowKeyDirection: function (key) {
    return this.arrowKeys[key];
  },
};
