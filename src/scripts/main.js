'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const startButton = document.querySelector('.start');

startButton.addEventListener('click', (e) => {
  game.restart();
  renderBoard();
  updateStatus();
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
});

document.addEventListener('keydown', (e) => {
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
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    default:
      return;
  }

  renderBoard();
  updateStatus();
});

function renderBoard() {
  const board = game.getState();
  const field = document.querySelector('.game-field tbody');

  field.innerHTML = '';

  for (const row of board) {
    const tr = document.createElement('tr');

    for (const cell of row) {
      const td = document.createElement('td');

      td.classList.add('field-cell');

      if (cell !== 0) {
        td.textContent = cell;
        td.classList.add(`field-cell--${cell}`);
      }

      tr.appendChild(td);
    }

    field.appendChild(tr);
  }
}

function updateStatus() {
  const scoreValue = document.querySelector('.game-score');
  const win = document.querySelector('.message-win');
  const lose = document.querySelector('.message-lose');
  const startMessage = document.querySelector('.message-start');

  scoreValue.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    win.classList.remove('hidden');
  } else {
    win.classList.add('hidden');
  }

  if (game.getStatus() === 'lose') {
    lose.classList.remove('hidden');
  } else {
    lose.classList.add('hidden');
  }

  if (game.getStatus() === 'idle') {
    startMessage.classList.remove('hidden');
  } else {
    startMessage.classList.add('hidden');
  }
}
