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
  document.querySelector('.message-lose').classList.add('hidden');
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

// Handle touch events for swipe gestures
let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;

// eslint-disable-next-line no-shadow
document.addEventListener('touchstart', (event) => {
  touchstartX = event.changedTouches[0].screenX;
  touchstartY = event.changedTouches[0].screenY;
});

// eslint-disable-next-line no-shadow
document.addEventListener('touchend', (event) => {
  touchendX = event.changedTouches[0].screenX;
  touchendY = event.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const distX = touchendX - touchstartX;
  const distY = touchendY - touchstartY;
  const threshold = 50; // Adjust threshold as needed

  let moved = false;

  if (Math.abs(distX) > threshold && Math.abs(distY) < Math.abs(distX) / 3) {
    if (distX > 0) {
      // Right swipe
      moved = game.moveRight();
    } else {
      // Left swipe
      moved = game.moveLeft();
    }
  } else if (
    Math.abs(distY) > threshold &&
    Math.abs(distX) < Math.abs(distY) / 3
  ) {
    if (distY > 0) {
      // Down swipe
      moved = game.moveDown();
    } else {
      // Up swipe
      moved = game.moveUp();
    }
  }

  if (moved) {
    game.addRandomTile();
    renderBoard();

    if (game.isGameOver()) {
      game.gameOver = true;
      document.querySelector('.message-lose').classList.remove('hidden');
    }
  }
}
renderBoard();
