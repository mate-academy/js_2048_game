'use strict';

const LABELS = {
  start: 'Start',
  restart: 'Restart',
};

export class StartButton {
  constructor(element, { onStart, onRestart }) {
    this.element = element;
    this.onStart = onStart;
    this.onRestart = onRestart;
    this.isStarted = false;

    this.element.addEventListener('click', () => this.handleClick());
  }

  handleClick() {
    if (this.isStarted) {
      this.onRestart();
    } else {
      this.onStart();
    }

    this.setStarted(!this.isStarted);
  }

  setStarted(isStarted) {
    this.isStarted = isStarted;

    const from = isStarted ? 'start' : 'restart';
    const to = isStarted ? 'restart' : 'start';

    this.element.classList.replace(from, to);
    this.element.textContent = LABELS[to];
  }
}
