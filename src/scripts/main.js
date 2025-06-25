'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const startBut = document.querySelector('.button.start');

startBut.addEventListener('click', () => {
  game.start();
  updateUI();
});

function updateUI() {
  const board = game.getState();
  const score = game.getScore();
  const gStatus = game.getStatus();

  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const val = board[row][col];

    cell.textContent = val === 0 ? '' : val;
    cell.className = 'field-cell';

    if (val > 0) {
      cell.classList.add(`field-cell--${val}`);
    }
  });

  document.querySelector('.game-score').textContent = score;

  document
    .querySelector('.message-start')
    .classList.toggle('hidden', gStatus !== 'idle');

  document
    .querySelector('.message-win')
    .classList.toggle('hidden', gStatus !== 'win');

  document
    .querySelector('.message-lose')
    .classList.toggle('hidden', gStatus !== 'lose');

  const btn = document.querySelector('.button');

  if (gStatus === 'idle') {
    btn.textContent = 'Start';
    btn.classList.add('start');
    btn.classList.remove('restart');
  } else {
    btn.textContent = 'Restart';
    btn.classList.add('restart');
    btn.classList.remove('start');
  }
}

document.addEventListener('keydown', (ev) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (ev.key) {
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
