'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

import Game from '../modules/Game.class.js';

const game = new Game();
let isGameStarted = false;

// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
  if (!isGameStarted) {
    return;
  }

  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  if (status !== 'playing') {
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

  updateUI();
});

function updateUI() {
  const board = game.getState();
  const score = game.getScore();
  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  document.querySelector('.game-score').textContent = score;

  const cells = document.querySelectorAll('.field-cell');
  let index = 0;

  for (const row of board) {
    for (const value of row) {
      const cell = cells[index];

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
      index++;
    }
  }

  document.querySelector('.message-start').classList.add('hidden');

  document
    .querySelector('.message-lose')
    .classList.toggle('hidden', status !== 'lose');

  document
    .querySelector('.message-win')
    .classList.toggle('hidden', status !== 'win');

  const startButton = document.querySelector('.button.start');

  if (status === 'idle') {
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
  } else {
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  }
}

document.querySelector('.button.start').addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    isGameStarted = true;
  } else {
    game.restart();
    isGameStarted = true;
  }
  updateUI();
});
