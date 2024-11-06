/* eslint-disable no-shadow */
'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.start');

startButton.addEventListener('click', (e) => {
  game.start();
  renderBoard(game);
});

document.addEventListener('keydown', (e) => {
  if (e.defaultPrevented) {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      renderBoard(game);
      break;

    case 'ArrowRight':
      game.moveRight();
      renderBoard(game);
      break;

    case 'ArrowUp':
      game.moveUp();
      renderBoard(game);
      break;

    case 'ArrowDown':
      game.moveDown();
      renderBoard(game);
      break;

    default:
      return;
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


