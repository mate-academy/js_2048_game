'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

// const board = document.querySelector('.game-field');
const start = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

start.addEventListener('click', () => {
  if (start.classList.contains('start')) {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  render();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  start.classList.add('restart');
  start.classList.remove('start');
  start.textContent = 'Restart';
});

function render() {
  const cells = document.querySelectorAll('.field-cell');
  const state = game.getState();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 4 + col;
      const cell = cells[index];
      const value = state[row][col];

      cell.className = 'field-cell';

      if (value === 0) {
        cell.textContent = '';
      } else {
        cell.textContent = value;
      }

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  score.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

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

  render();
});
