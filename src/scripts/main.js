'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

function renderBoard() {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, i) => {
    const row = Math.floor(i / game.boardSize);
    const col = i % game.boardSize;

    cell.className = 'field-cell';

    const value = game.board[row][col];

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    } else {
      cell.textContent = '';
    }
  });
  document.querySelector('.game-score').textContent = game.getScore();
}

document.querySelector('.start').addEventListener('click', () => {
  game.start();
  renderBoard();
  document.querySelector('.button').classList.remove('start');
  document.querySelector('.button').classList.add('restart');
  document.querySelector('.restart').textContent = 'Restart';
  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden')
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
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
  }

  if (moved) {
    game.addRandomTile();
    renderBoard();

    if (game.isGameOver()) {
      game.gameOver = true;
      document.querySelector('.message-lose').classList.remove('hidden');
    }
  }
});

renderBoard();
