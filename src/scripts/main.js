'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.button.start').addEventListener('click', () => {
    if (game.getStatus() === 'playing') {
      game.restart();
    } else {
      game.start();
    }
    updateUI();
  });

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
    }

    if (game.moved) {
      updateUI();
    }
  });

  function updateUI() {
    const board = game.getState();
    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = board[row][col];

      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
    });

    document.querySelector('.game-score').textContent = game.getScore();
  }

  updateUI();
});
