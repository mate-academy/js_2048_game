'use strict';

import Game from '../modules/Game.class';

// Uncomment the next lines to use your game instance in the browser
document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.button.start');
  const scoreElement = document.querySelector('.game-score');
  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');

  const game = new Game();

  startButton.addEventListener('click', () => {
    if (startButton.classList.contains('start')) {
      game.start();
      startButton.textContent = 'Restart';
      startButton.classList.replace('start', 'restart');
      messageStart.classList.add('hidden');
      updateTable(game.getState());
    } else {
      game.restart();
      updateTable(game.getState());
      updateScore(game.getScore());
      startButton.textContent = 'Start';
      startButton.classList.replace('restart', 'start');
      messageStart.classList.remove('hidden');
      messageLose.classList.add('hidden');
    }
  });

  // eslint-disable-next-line no-shadow
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
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
    updateTable(game.getState());
    updateScore(game.getScore());
  });

  function updateTable(state) {
    const cells = document.querySelectorAll('.field-cell');
    let index = 0;

    state.forEach((row) => {
      row.forEach((cellValue) => {
        const cell = cells[index++];

        cell.textContent = cellValue !== 0 ? cellValue : '';
        cell.className = `field-cell ${cellValue ? 'field-cell--' + cellValue : ''}`;
      });
    });

    updateGameStatus();
  }

  function updateScore(score) {
    scoreElement.textContent = score;
  }

  function updateGameStatus() {
    if (game.status === 'win') {
      messageWin.classList.remove('hidden');
    } else if (game.status === 'lose') {
      messageLose.classList.remove('hidden');
    }
  }
});

// Write your code here
