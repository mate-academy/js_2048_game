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
  document.querySelector('.message-start').classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  if (e.key === 'ArrowLeft') {
    moved = game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    moved = game.moveRight();
  } else if (e.key === 'ArrowUp') {
    moved = game.moveUp();
  } else if (e.key === 'ArrowDown') {
    moved = game.moveDown();
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

document.getElementById('play-again-btn').addEventListener('click', () => {
  game.restart();
  renderBoard();
  document.querySelector('.message-lose').classList.add('hidden');
});

renderBoard();
