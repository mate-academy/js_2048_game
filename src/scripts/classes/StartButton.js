export class StartButton {
  constructor(buttonElement, stopGame, startGame) {
    this.HTMLelement = buttonElement;
    this.isRestart = false;

    this.setupEventListener(stopGame, startGame);
  }

  setupEventListener(stopGame, startGame) {
    this.HTMLelement.addEventListener('click', () => {
      if (this.isRestart) {
        stopGame();
      } else {
        startGame();
      }
    });
  }

  toggle() {
    if (this.isRestart) {
      this.HTMLelement.classList.remove('tile--button--restart');
      this.HTMLelement.classList.add('tile--button--start');
      this.HTMLelement.textContent = 'Start';
    } else {
      this.HTMLelement.classList.remove('tile--button--start');
      this.HTMLelement.classList.add('tile--button--restart');
      this.HTMLelement.textContent = 'Restart';
    }

    this.isRestart = !this.isRestart;
  };
}
