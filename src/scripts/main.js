const Game = require('../modules/Game.class');

// eslint-disable-next-line no-unused-expressions
('use strict');

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  const startButton = document.getElementById('start-button');
  const scoreElement = document.getElementById('score');
  const statusElement = document.getElementById('status');
  const gameBoard = document.getElementById('game-board');

  function updateUI() {
    const state = game.getState();
    const cells = gameBoard.getElementsByClassName('field-cell');

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const value = state[Math.floor(i / 4)][i % 4];

      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
    }
    scoreElement.textContent = game.getScore();
    statusElement.textContent = game.getStatus();
  }

  startButton.addEventListener('click', () => {
    if (game.getStatus() === 'playing') {
      game.restart();
    } else {
      game.start();
    }
    updateUI();
    startButton.textContent = 'Restart';
  });

  // eslint-disable-next-line no-shadow
  document.addEventListener('keydown', (event) => {
    let moved = false;

    switch (event.key) {
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
      updateUI();
    }
  });

  updateUI();
});
