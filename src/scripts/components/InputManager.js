export class InputManager {
  constructor(touchTarget) {
    this.target = touchTarget;
    this.moveCallback = undefined;
    this.updateCallback = undefined;

    this.direction = {
      'ArrowLeft': {
        revers: false,
        changeAxis: false,
      },
      'ArrowUp': {
        revers: false,
        changeAxis: true,
      },
      'ArrowRight': {
        revers: true,
        changeAxis: false,
      },
      'ArrowDown': {
        revers: true,
        changeAxis: true,
      },
    };

    this.touchStartX = 0;
    this.touchStartY = 0;

    this.keydownListener = this.handleKeyDown.bind(this);
    this.tuchStartListener = this.handleTouchStart.bind(this);
    this.tuchEndListener = this.handleTouchEnd.bind(this);

    this.initialize();
  }

  initialize() {
    this.initEvents();
  }

  setEventCallbacks(moveCallback, updateCallback) {
    this.moveCallback = moveCallback;
    this.updateCallback = updateCallback;
  }

  handleKeyDown(e) {
    const { key } = e;

    if (this.direction[key]) {
      e.preventDefault();
      this.moveCallback(this.direction[key]);

      this.updateCallback();
    }
  };

  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
    this.touchStartY = e.changedTouches[0].screenY;
  }

  handleTouchEnd(e) {
    const diffX = e.changedTouches[0].screenX - this.touchStartX;
    const diffY = e.changedTouches[0].screenY - this.touchStartY;
    const ratioX = Math.abs(diffX / diffY);
    const ratioY = Math.abs(diffY / diffX);
    const absDiff = Math.abs(ratioX > ratioY ? diffX : diffY);
    const key = this.swipeDirection(diffX, diffY, ratioX, ratioY);

    if (absDiff < 30) {
      return;
    }

    if (this.direction[key]) {
      e.preventDefault();
      this.moveCallback(this.direction[key]);

      this.updateCallback();
    }
  }

  swipeDirection(diffX, diffY, ratioX, ratioY) {
    if (ratioX > ratioY) {
      if (diffX >= 0) {
        return 'ArrowRight';
      } else {
        return 'ArrowLeft';
      }
    } else {
      if (diffY >= 0) {
        return 'ArrowDown';
      } else {
        return 'ArrowUp';
      }
    }
  }

  initEvents() {
    document.addEventListener('keydown', this.keydownListener);
    this.target.addEventListener('touchstart', this.tuchStartListener);
    this.target.addEventListener('touchend', this.tuchEndListener);
  }

  removeEvents() {
    document.removeEventListener('keydown', this.keydownListener);
    this.target.removeEventListener('touchstart', this.tuchStartListener);
    this.target.removeEventListener('touchend', this.tuchEndListener);
  }
}
