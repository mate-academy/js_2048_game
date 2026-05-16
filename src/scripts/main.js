'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
// eslint-disable-next-line no-unused-vars
import Game from '../modules/Game.class.js';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState().flat();

  cells.forEach((cell, index) => {
    const value = state[index];
    const prevValue = Number(cell.dataset.value || 0);

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.textContent = value;

      cell.classList.add(`field-cell--${value}`);

      if (prevValue === 0) {
        cell.classList.add('tile-new');
      }

      if (value > prevValue && prevValue !== 0) {
        cell.classList.add('tile-merge');
      }
    } else {
      cell.textContent = '';
    }

    cell.dataset.value = value;
  });

  scoreElement.textContent = game.getScore();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    button.textContent = 'Restart';

    button.classList.remove('start');
    button.classList.add('restart');

    startMessage.classList.add('hidden');
  } else {
    game.restart();

    button.textContent = 'Start';

    button.classList.remove('restart');
    button.classList.add('start');

    startMessage.classList.remove('hidden');
  }

  renderBoard();
});

// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (event.key) {
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

  renderBoard();
});

renderBoard();
