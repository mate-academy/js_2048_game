'use strict';
// const Game = require('../modules/Game.class');

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button');
  const scoreElement = document.getElementById('score');
  const statusElement = document.getElementById('status');
  const gameBoard = document.getElementById('game-board');
  const cells = gameBoard.getElementsByClassName('field-cell');

  let previousState = [];

  function updateUI() {
    const state = game.getState();

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const value = state[Math.floor(i / 4)][i % 4];

      if (previousState[i] !== value) {
        cell.className = 'field-cell';

        if (value) {
          cell.classList.add(`field-cell--${value}`);
          cell.textContent = value;
        } else {
          cell.textContent = '';
        }
      }
    }
    previousState = state.flat();
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

    startButton.textContent =
      game.getStatus() === 'playing' ? 'Restart' : 'Start';
  });

  const keyMap = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  // eslint-disable-next-line no-shadow
  document.addEventListener('keydown', (event) => {
    const moveFunction = keyMap[event.key];

    if (moveFunction && moveFunction()) {
      updateUI();
    }
  });

  updateUI();
});
