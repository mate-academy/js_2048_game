'use strict';

// Uncomment the next lines to use your game instance in the browser
import { Game } from '../modules/Game.class.js';

const game = new Game();

// Write your code here
const button = document.querySelector('button');
const score = document.querySelector('.game-score');
const startMsg = document.querySelector('.message-start');
const loseMsg = document.querySelector('.message-lose');
const winMsg = document.querySelector('.message-win');

const cells = document.querySelectorAll('.field-cell');
const renderField = () => {
  const state = game.getState();

  state.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = cells[rowIndex * 4 + colIndex];

      cell.textContent = value || '';
      cell.className = 'field-cell'; // reset

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });
};

const updateButtonRestart = () => {
  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');
  startMsg.classList.add('hidden');
};

game.start();

renderField();

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowUp':
      game.moveUp();
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

  renderField();
  score.textContent = game.getScore();

  if (game.getStatus() === 'lose') {
    loseMsg.classList.remove('hidden');
  } else if (game.getStatus() === 'win') {
    winMsg.classList.remove('hidden');
  }

  // console.table(game.getState());

  // console.log(game.getStatus());
});

button.addEventListener('click', () => {
  game.restart();
  score.textContent = 0;
  loseMsg.classList.add('hidden');
  winMsg.classList.add('hidden');
});

document.addEventListener('keydown', updateButtonRestart, { once: true });
