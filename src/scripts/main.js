'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const startMessage = document.querySelector('.message-start');
  const startButton = document.querySelector('.button.start');

  startButton.addEventListener('click', () => {
    if (game.getStatus() === 'playing' || game.getStatus() === 'lose') {
      game.restart();

      startButton.textContent = 'Start';
      startButton.classList.remove('restart');

      if (startMessage) {
        startMessage.classList.remove('hidden');
      }
    } else {
      game.start();

      startButton.textContent = 'Restart';
      startButton.classList.add('restart');

      if (startMessage) {
        startMessage.classList.add('hidden');
      }
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
