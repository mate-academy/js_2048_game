'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.start');

const message = document.querySelectorAll('.message');

const win = document.querySelector('.message-win');
const lose = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

const score = document.querySelector('.game-score');

button.addEventListener('click', () => {
  game.start();

  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');

  render(game.getState());
});

document.addEventListener('keydown', (evnt) => {
  switch (evnt.key) {
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

  render(game.getState());
});

function render(board) {
  const rows = document.querySelectorAll('.game-field .field-row');

  board.forEach((row, rowIndex) => {
    const cells = rows[rowIndex].querySelectorAll('.field-cell');

    row.forEach((value, colIndex) => {
      const cell = cells[colIndex];

      if (value > 0) {
        cell.textContent = value;
        cell.className = 'field-cell';
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
        cell.className = 'field-cell';
      }
    });
  });

  if (game.getScore() >= 0) {
    score.textContent = game.getScore();
  }

  switch (game.getStatus()) {
    case 'win':
      startMessage.classList.add('hidden');

      win.classList.remove('hidden');
      break;

    case 'lose':
      startMessage.classList.add('hidden');

      lose.classList.remove('hidden');
      break;

    default:
      message.forEach((el) => el.classList.add('hidden'));
  }
}
// // Write your code here
