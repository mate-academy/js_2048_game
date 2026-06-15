'use strict';

import Game from '../modules/Game.class';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const scoreElement = document.querySelector('.game-score');
  const buttonStart =
    document.querySelector('.button\\.start') ||
    document.querySelector('.button.start');

  const startMessage = document.querySelector('.message-start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  function updateScoreDisplay() {
    if (scoreElement) {
      scoreElement.textContent = game.getScore();
    }
  }

  function checkStatus() {
    const currentStatus = game.getStatus();

    if (startMessage) {
      startMessage.classList.add('hidden');
    }

    if (winMessage) {
      winMessage.classList.add('hidden');
    }

    if (loseMessage) {
      loseMessage.classList.add('hidden');
    }

    if (currentStatus === 'idle' && startMessage) {
      startMessage.classList.remove('hidden');
    } else if (currentStatus === 'win' && winMessage) {
      winMessage.classList.remove('hidden');
    } else if (currentStatus === 'lose' && loseMessage) {
      loseMessage.classList.remove('hidden');
    }
  }

  if (buttonStart) {
    buttonStart.addEventListener('click', () => {
      game.start();
      updateScoreDisplay();

      buttonStart.textContent = 'Restart';
      buttonStart.classList.remove('start');
      buttonStart.classList.add('restart');

      checkStatus();
      renderGame();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      return;
    }

    if (game.getStatus() !== 'playing') {
      return;
    }

    if (e.key === 'ArrowLeft') {
      game.moveLeft();
    } else if (e.key === 'ArrowRight') {
      game.moveRight();
    } else if (e.key === 'ArrowUp') {
      game.moveUp();
    } else if (e.key === 'ArrowDown') {
      game.moveDown();
    }

    updateScoreDisplay();
    checkStatus();
    renderGame();
  });

  function renderGame() {
    const cells = document.querySelectorAll('.field-cell');
    const state = game.getState();

    if (!cells || cells.length === 0) {
      return;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cellIndex = row * 4 + col;
        const cellValue = state[row][col];
        const cell = cells[cellIndex];

        if (cell) {
          cell.textContent = '';
          cell.className = 'field-cell';

          if (cellValue) {
            cell.textContent = cellValue;
            cell.classList.add(`field-cell--${cellValue}`);
          }
        }
      }
    }
  }

  checkStatus();
  renderGame();
});
