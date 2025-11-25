'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const button = document.querySelector('.button');

function renderGame() {
  const cells = document.querySelectorAll('.field-cell');
  const state = game.getState();

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = state[r][c];
      const cell = cells[r * 4 + c];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  document.querySelector('.game-score').textContent = game.getScore();

  const gameStatus = game.getStatus();

  const startMessage = document.querySelector('.message-start');
  const loseMessage = document.querySelector('.message-lose');
  const winMessage = document.querySelector('.message-win');

  if (startMessage) {
    startMessage.classList.toggle('hidden', gameStatus !== 'idle');
  }

  if (loseMessage) {
    loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
  }

  if (winMessage) {
    winMessage.classList.toggle('hidden', gameStatus !== 'win');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  if (game.getStatus() === 'playing') {
    button.textContent = 'Restart';
    button.classList.add('restart');
  }
  renderGame();
});

window.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
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

  renderGame();
});
