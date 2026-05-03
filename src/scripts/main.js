'use strict';

// Uncomment the next lines to use your game instance in the browser
// Замість const Game = require(...)
import Game from '../modules/Game.class';

const game = new Game();

function updateUI() {
  const cells = document.querySelectorAll('.field-cell');
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  const scoreEl = document.querySelector('.game-score');

  scoreEl.textContent = game.getScore();

  const messageContainer = document.querySelector('.message-container');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const messageStart = document.querySelector('.message-start');

  messageContainer.classList.remove('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (game.getStatus() === 'playing') {
    messageStart.classList.add('hidden');
  }

  if (game.getStatus() === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (game.getStatus() === 'playing') {
    messageStart.classList.add('hidden');
  }
}

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  game.restart();
  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');
  updateUI();
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
    default:
      return;
  }

  e.preventDefault();
  updateUI();
});
