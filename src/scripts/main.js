'use strict';

'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button-start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateBoard() {
  const state = game.getState();

  state.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = document.querySelector(
        `[data-position="${rowIndex}-${colIndex}"]`,
      );

      if (!cell) {
        return;
      }

      cell.textContent = value !== 0 ? value : '';
      updateCellClass(cell, value);
    });
  });
}

function updateCellClass(cell, value) {
  cell.className = 'field-cell';

  if (value !== 0) {
    cell.classList.add(`field-cell--${value}`);
  }
}

function updateScore() {
  scoreElement.textContent = game.getScore();
}

function updateMessages() {
  const statusGame = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  switch (statusGame) {
    case 'win':
      messageWin.classList.remove('hidden');
      break;
    case 'lose':
      messageLose.classList.remove('hidden');
      break;
    case 'idle':
      messageStart.classList.remove('hidden');
      break;
    default:
      break;
  }
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    updateBoard();
    updateMessages();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else {
    game.restart();
    updateBoard();
    updateScore();
    updateMessages();
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
  }
});

const KEYS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
};

// eslint-disable-next-line no-shadow
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case KEYS.LEFT:
      game.moveLeft();
      break;
    case KEYS.RIGHT:
      game.moveRight();
      break;
    case KEYS.UP:
      game.moveUp();
      break;
    case KEYS.DOWN:
      game.moveDown();
      break;
    default:
      return;
  }

  updateBoard();
  updateScore();
  updateMessages();

  // eslint-disable-next-line no-shadow
  // window.addEventListener('keydown', (event) => {
  //   switch (event.key) {
  //     case 'ArrowLeft':
  //       game.moveLeft();
  //       break;
  //     case 'ArrowRight':
  //       game.moveRight();
  //       break;
  //     case 'ArrowUp':
  //       game.moveUp();
  //       break;
  //     case 'ArrowDown':
  //       game.moveDown();
  //       break;
  //     default:
  //       return;
  //   }

  //   updateBoard();
  //   updateScore();
  //   updateMessages();
});
