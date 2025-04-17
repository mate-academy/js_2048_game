'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else {
    game.restart();
  }

  renderBoard();
  updateScore();
  updateMessages();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
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
      renderBoard();
      updateScore();

      if (game.getStatus() === 'win') {
        document.querySelector('.message-win').classList.remove('hidden');
      }

      if (game.getStatus() === 'lose') {
        document.querySelector('.message-lose').classList.remove('hidden');
      }
    }
  }
});

function renderBoard() {
  const state = game.getState();
  const last = game.lastInserted;
  const merges = game.mergePositions || [];

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.className = 'field-cell';
    cell.textContent = value === 0 ? '' : value;

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);

      if (last && last.row === row && last.col === col) {
        cell.classList.add('spawn');
      }

      if (merges.some((t) => t.row === row && t.col === col)) {
        cell.classList.add('merge');
      }
    }
  });

  game.mergePositions = [];
}

function updateScore() {
  scoreElement.textContent = game.getScore();
}

function updateMessages() {
  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
}
