'use strict';

import Game from '../modules/Game.class.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  const scoreElement = document.querySelector('.game-score');
  const mainButton = document.querySelector('.button');
  const cells = document.querySelectorAll('.field-cell');

  const msgStart = document.querySelector('.message-start');
  const msgWin = document.querySelector('.message-win');
  const msgLose = document.querySelector('.message-lose');

  function updateUI() {
    const board = game.getState();
    const stat = game.getStatus();

    scoreElement.textContent = game.getScore();

    let cellIndex = 0;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cellValue = board[r][c];
        const cellElement = cells[cellIndex];

        cellElement.textContent = cellValue === 0 ? '' : cellValue;
        cellElement.className = 'field-cell';

        if (cellValue > 0) {
          cellElement.classList.add(`field-cell--${cellValue}`);
        }
        cellIndex++;
      }
    }

    msgStart.classList.add('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');

    if (stat === 'idle') {
      msgStart.classList.remove('hidden');
      mainButton.textContent = 'Start';
      mainButton.className = 'button start';
    } else if (stat === 'playing') {
      mainButton.textContent = 'Restart';
      mainButton.className = 'button restart';
    } else if (stat === 'win') {
      msgWin.classList.remove('hidden');
      mainButton.textContent = 'Restart';
      mainButton.className = 'button restart';
    } else if (stat === 'lose') {
      msgLose.classList.remove('hidden');
      mainButton.textContent = 'Restart';
      mainButton.className = 'button restart';
    }
  }

  mainButton.addEventListener('click', () => {
    const stat = game.getStatus();

    if (stat === 'idle') {
      game.start();
    } else {
      game.restart();
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
      default:
        return;
    }

    ev.preventDefault();
    updateUI();
  });

  updateUI();
});
