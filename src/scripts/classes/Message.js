export class Message {
  constructor(messageElement, scoreCounter, startGame, stopGame) {
    this.messageElement = messageElement;
    this.scoreCounter = scoreCounter;
    this.startGame = startGame;
    this.stopGame = stopGame;

    this.className = this.messageElement.className;

    this.messageTextNode = document.querySelector(`.${this.className}__text`);
    this.recordNode = document.querySelector(`.${this.className}__record-val`);
    this.counterNode = document.querySelector(`.${this.className}__score-val`);
    this.closeButton = document.querySelector(`.${this.className}__close`);

    this.tryAgainButton
      = document.querySelector(`.${this.className}__try-again`);

    this.closeMessageHandler = this.closeMessage.bind(this);
    this.closeAndRestartHandler = this.closeAndRestart.bind(this);
  }

  showMessage(won) {
    const messageText = won
      ? 'Winner! Congrats! You did it!'
      : 'You lose! Restart the game?';

    this.messageElement.classList.add('show');

    this.messageTextNode.textContent = messageText;
    this.recordNode.textContent = this.scoreCounter.record;
    this.counterNode.textContent = this.scoreCounter.counter;

    this.tryAgainButton.addEventListener('click', this.closeAndRestartHandler);
    this.closeButton.addEventListener('click', this.closeMessageHandler);
  }

  closeAndRestart() {
    this.closeMessage();
    this.stopGame();
    this.startGame();
  }

  closeMessage() {
    this.messageElement.classList.remove('show');

    this.tryAgainButton.removeEventListener('click', this.closeMessageHandler);
    this.closeButton.removeEventListener('click', this.closeMessageHandler);
  }
}
