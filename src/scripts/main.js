'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.start');
const fieldRows = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
const messages = document.querySelector('.message-container').children;

function updateScore() {
  gameScore.textContent = game.getScore();
}

function updateStatus() {
  const [messageLose, messageWin, messageStart] = messages;
  const gameStatus = game.getStatus();
  const hiddenClass = 'hidden';

  Array.from(messages).forEach((message) => {
    message.classList.add(hiddenClass);
  });

  switch (gameStatus) {
    case Game.Statuses.IDLE:
      messageStart.classList.remove(hiddenClass);
      break;
    case Game.Statuses.WIN:
      messageWin.classList.remove(hiddenClass);
      break;
    case Game.Statuses.LOSE:
      messageLose.classList.remove(hiddenClass);
      break;
    default:
      break;
  }
}

function updateCells() {
  const state = game.getState();

  Array.from(fieldRows).forEach((row, rowIndex) => {
    for (let colIndex = 0; colIndex < 4; colIndex++) {
      const currentNumber = +state[rowIndex][colIndex];
      const currentElement = row.children[colIndex];

      currentElement.textContent = currentNumber || '';
      currentElement.classList = '';
      currentElement.classList.add('field-cell');

      if (currentNumber) {
        currentElement.classList.add(`field-cell--${currentNumber}`);
      }
    }
  });
}

document.addEventListener('keydown', (evt) => {
  if (game.getStatus() !== Game.Statuses.PLAYING) {
    return;
  }

  const keyName = evt.key;

  switch (keyName) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      return;
  }

  updateCells();
  updateScore();
  updateStatus();
});

startBtn.addEventListener('click', () => {
  if (startBtn.classList.contains('start')) {
    game.start();
    updateCells();
    updateScore();
    updateStatus();

    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
  } else if (startBtn.classList.contains('restart')) {
    startBtn.classList.remove('restart');
    startBtn.classList.add('start');
    startBtn.textContent = 'Start';

    game.restart();
    updateCells();
    updateScore();
    updateStatus();
  }
});
