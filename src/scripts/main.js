'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const startButton = document.querySelector('.button.start');

startButton.addEventListener('click', (e) => {
  if (game.getStatus() === 'idle') {
    game.start();
    startButton.textContent = 'restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();
    startButton.textContent = 'start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }

  messageStart.classList.add('hidden');
  renderBoard();
});

const cells = document.querySelectorAll('.field-cell');

function renderBoard() {
  const scoreCount = document.querySelector('.game-score');

  scoreCount.textContent = game.getScore();

  game.getState().forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellIndex = rowIndex * 4 + colIndex;

      cells[cellIndex].textContent = cell === 0 ? '' : cell;
      cells[cellIndex].className = 'field-cell';

      if (cell !== 0) {
        cells[cellIndex].classList.add('field-cell--' + cell);
      }

      if (
        game.lastTile &&
        rowIndex === game.lastTile.row &&
        colIndex === game.lastTile.col
      ) {
        cells[cellIndex].classList.add('field-cell--new');
      }
    });
  });

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'idle') {
    game.start();
    messageStart.classList.add('hidden');
    startButton.textContent = 'restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    renderBoard();
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      renderBoard();
      break;

    case 'ArrowRight':
      game.moveRight();
      renderBoard();
      break;

    case 'ArrowUp':
      game.moveUp();
      renderBoard();
      break;

    case 'ArrowDown':
      game.moveDown();
      renderBoard();
      break;
  }
});
