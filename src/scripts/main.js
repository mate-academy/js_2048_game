'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

import Game from '../modules/Game.class.js';

const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const startButton = document.querySelector('.button.start');
const boardElement = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');

messageLose.addEventListener('click', () => {
  game = new Game();
  game.restart();
  render();
  messageLose.classList.add('hidden');
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
});

let game = null;

startButton.addEventListener('click', () => {
  game = new Game();

  game.restart();
  render();
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
});

function showMessage(someStatus) {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (someStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (someStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (someStatus === 'start') {
    messageStart.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (someEvent) => {
  if (!game || game.getStatus() !== 'playing') {
    return;
  }

  switch (someEvent.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      return;
  }
  render();

  if (game.getStatus() === 'win') {
    showMessage('win');
  }

  if (game.getStatus() === 'lose') {
    showMessage('lose');
  }
});

function render() {
  if (!game) {
    return;
  }

  const board = game.getState();
  const score = game.getScore();
  const rows = boardElement.querySelectorAll('.field-row');

  rows.forEach((rowEl, rowIdx) => {
    const cells = rowEl.querySelectorAll('.field-cell');

    cells.forEach((cellEl, colIdx) => {
      const value = board[rowIdx][colIdx];

      cellEl.textContent = value === 0 ? '' : value;
      cellEl.className = 'field-cell';

      if (value !== 0) {
        cellEl.classList.add(`field-cells--${value}`);
      }
    });
  });

  scoreElement.textContent = score;
}

window.Game = Game;
