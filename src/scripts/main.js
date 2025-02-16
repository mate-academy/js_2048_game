'use strict';

const { GAME_STATUS } = require('../constants/constants');

const Game = require('../modules/Game.class');
const game = new Game();
const button = document.querySelector('.button');
const rows = document.querySelectorAll('.field-row');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const score = document.querySelector('.game-score');

button.addEventListener('click', () => {
  if (button.classList.contains('restart')) {
    game.restart();
  }
  game.start();

  button.classList.remove('start');
  button.classList.add('restart');
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  button.textContent = 'Restart';
  updateState(game.getState());
});

document.addEventListener('keydown', (e) => {
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
  }

  updateState(game.getState());

  if (game.getStatus() === GAME_STATUS.WIN) {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === GAME_STATUS.LOSE) {
    loseMessage.classList.remove('hidden');
  }
});

function updateState(state) {
  rows.forEach((row, i) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, k) => {
      const value = state[i][k];

      cell.className = 'field-cell';

      if (value === 0) {
        cell.textContent = '';
      } else {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });

  score.textContent = game.getScore();
}
