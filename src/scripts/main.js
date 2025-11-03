'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const gameBoard = document.querySelector('.game-field');
  const startButton = document.querySelector('.button');
  const startMessage = document.querySelector('.message-start');
  const gameOverMessage = document.querySelector('.message-lose');
  const winMessage = document.querySelector('.message-win');
  const scoreElement = document.querySelector('.game-score');

  function updateBoard() {
    const state = game.getState();
    const cells = gameBoard.querySelectorAll('.field-cell');

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = state[row][col];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
      }
      cell.textContent = value || '';
    });

    scoreElement.textContent = game.getScore();
  }

  function updateGameStatus() {
    const gameStatus = game.getStatus();

    startMessage.classList.toggle('hidden', gameStatus !== 'idle');
    gameOverMessage.classList.toggle('hidden', gameStatus !== 'lose');
    winMessage.classList.toggle('hidden', gameStatus !== 'win');

    startButton.classList.toggle('start', gameStatus === 'idle');
    startButton.classList.toggle('restart', gameStatus !== 'idle');
    startButton.textContent = gameStatus === 'idle' ? 'Start' : 'Restart';
  }

  startButton.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
      game.start();
    } else {
      game.restart();
    }
    updateBoard();
    updateGameStatus();
  });

  document.addEventListener('keydown', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    switch (e.key) {
      case 'ArrowLeft':
        moved = game.move('left');
        break;
      case 'ArrowRight':
        moved = game.move('right');
        break;
      case 'ArrowUp':
        moved = game.move('up');
        break;
      case 'ArrowDown':
        moved = game.move('down');
        break;
    }

    if (moved) {
      updateBoard();
      updateGameStatus();
    }
  });
});
