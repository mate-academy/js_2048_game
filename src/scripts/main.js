const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    setState();

    startButton.classList = 'button restart';
    startButton.innerHTML = 'Restart';
    startMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');

    getScore();
  } else if (startButton.classList.contains('restart')) {
    game.restart();
    setState();

    startButton.classList = 'button start';
    startButton.innerHTML = 'Start';
    startMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');

    getScore();
  }
});

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      game.moveUp();
      setState();
      break;
    case 'ArrowDown':
    case 's':
      game.moveDown();
      setState();
      break;
    case 'ArrowLeft':
    case 'a':
      game.moveLeft();
      setState();
      break;
    case 'ArrowRight':
    case 'd':
      game.moveRight();
      setState();
      break;
  }

  getScore();
  updateMessages();
});

function updateMessages() {
  if (game.getStatus() === Game.gameStatus.lose) {
    loseMessage.classList.remove('hidden');
  } else if (game.getStatus() === Game.gameStatus.win) {
    winMessage.classList.remove('hidden');
  }
}

function getScore() {
  gameScore.innerHTML = game.getScore();
}

function setState() {
  const cells = document.querySelectorAll('.field-cell');
  const stateValues = game.state.flat();

  for (let i = 0; i < stateValues.length; i++) {
    const currentCell = cells[i];
    const currentValue = stateValues[i];

    currentCell.classList = ['field-cell'];

    if (currentValue > 0) {
      currentCell.textContent = currentValue;
      currentCell.classList.add(`field-cell--${currentValue}`);
    } else {
      currentCell.textContent = '';
    }
  }
}
