export function createStartButton(buttonElement) {
  const startButton = buttonElement;

  startButton.isRestart = false;

  startButton.toggle = function() {
    if (this.isRestart) {
      this.classList.remove('tile--button--restart');
      this.classList.add('tile--button--start');
      this.textContent = 'Start';
    } else {
      this.classList.remove('tile--button--start');
      this.classList.add('tile--button--restart');
      this.textContent = 'Restart';
    }

    this.isRestart = !this.isRestart;
  };

  return startButton;
}
