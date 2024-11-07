/* eslint-disable no-shadow */
'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const button = document.querySelector('.button');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    renderBoard(game);
  } else {
    game.restart();
    renderBoard(game);
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.defaultPrevented) {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    default:
      return;
  }

  if (moved) {
    renderBoard(game);

    if (button.classList.contains('start')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
    }
  }

  e.preventDefault();
});

function renderBoard(game) {
  const board = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cellIndex = row * 4 + col;
      const cell = cells[cellIndex];

      if (board[row][col] === 0) {
        cell.textContent = '';
        cell.className = 'field-cell';
      } else {
        cell.textContent = board[row][col];
        cell.className = `field-cell field-cell--${board[row][col]}`;
      }
    }
  }

  const scoreElement = document.querySelector('.game-score');
  const score = game.getScore();

  scoreElement.innerHTML = '';
  scoreElement.textContent = score;
}
