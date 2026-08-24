'use strict';

const ARROW_KEYS = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
};

export class KeyboardControls {
  constructor(onMove) {
    this.onMove = onMove;

    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    const direction = ARROW_KEYS[e.key];

    if (!direction) {
      return;
    }

    e.preventDefault();
    this.onMove(direction);
  }
}
