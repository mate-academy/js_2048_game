'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const startButton = document.querySelector('.button.start');
const restartButton = document.querySelector('.button.restart');

function renderBoard() {
  scoreElement.textContent = game.getScore();

  game.board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = cells[rowIndex * 4 + colIndex];

      if (cell !== 0) {
        cellElement.textContent = cell;
        cellElement.classList.remove(...cellElement.classList);
        cellElement.classList.add('field-cell');
        cellElement.classList.add(`field-cell--${cell}`);
      } else {
        cellElement.textContent = '';
        cellElement.classList.remove(...cellElement.classList);
        cellElement.classList.add('field-cell');
      }
    });
  });

  if (game.status === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  game.start();
  restartButton.classList.remove('hidden');
  startButton.classList.add('hidden');
  messageStart.classList.add('hidden');

  renderBoard();
});

restartButton.addEventListener('click', () => {
  restartButton.classList.add('hidden');
  startButton.classList.remove('hidden');
  game.restart();

  renderBoard();
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
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
});
