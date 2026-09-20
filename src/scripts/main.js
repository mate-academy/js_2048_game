'use strict';

import { Game } from '../modules/Game.class.js';

const game = new Game();
const scoreElement = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

function updateUI() {
  const flatBoard = game.board.flat();

  cells.forEach((cell, index) => {
    const value = flatBoard[index];

    cell.textContent = value === 0 ? '' : value;

    cell.setAttribute('data-value', value);

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.score;

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  if (game.status === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (game.status === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (
    game.status === 'playing' ||
    game.status === 'lose' ||
    game.status === 'win'
  ) {
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  }
}

startBtn.addEventListener('click', () => {
  game.restart();

  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  updateUI();
});

window.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
    return;
  }

  const oldBoard = JSON.stringify(game.board);

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

  if (oldBoard !== JSON.stringify(game.board)) {
    updateUI();
  }
});
