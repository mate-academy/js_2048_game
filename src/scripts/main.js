'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

function initializeGame() {
  const boardElement = document.querySelector('.game-field');
  const scoreElement = document.querySelector('.game-score');
  const button = document.querySelector('.start');
  const messageStart = document.querySelector('.message-start');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');

  function renderBoard() {
    boardElement.innerHTML = '';

    game.getState().forEach((row) => {
      const rowElement = document.createElement('tr');

      rowElement.classList.add('field-row');

      row.forEach((cell) => {
        const cellElement = document.createElement('td');

        cellElement.classList.add('field-cell');

        if (cell !== 0) {
          cellElement.classList.add(`field-cell--${cell}`);
          cellElement.textContent = cell;
        }
        rowElement.appendChild(cellElement);
      });
      boardElement.appendChild(rowElement);
    });
  }

  function renderScore() {
    scoreElement.textContent = game.getScore();
  }

  function renderStatus() {
    messageStart.classList.toggle('hidden', game.getStatus() !== 'idle');
    messageLose.classList.toggle('hidden', game.getStatus() !== 'lose');
    messageWin.classList.toggle('hidden', game.getStatus() !== 'win');
  }

  button.addEventListener('click', () => {
    const buttonText = button.textContent;

    if (buttonText === 'Start') {
      game.start();
      button.textContent = 'Restart';
      button.classList.replace('start', 'restart');
    } else {
      game.restart();
      renderScore(0);
      button.textContent = 'Start';
      button.classList.replace('restart', 'start');
    }
    renderBoard();
    renderScore();
    renderStatus();
  });

  document.addEventListener('keydown', (keyEvent) => {
    const key = keyEvent.key;

    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
      keyEvent.preventDefault();

      switch (key) {
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
      renderBoard();
      renderScore();
      renderStatus();
    }
  });
}

document.addEventListener('DOMContentLoaded', initializeGame);
