'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const start = document.querySelector('.start');

start.addEventListener('click', () => {
  if (start.textContent === 'Start') {
    start.classList.add('restart');
    start.classList.remove('start');
    start.textContent = 'Restart';

    game.start();
    updateField();
    updateStatus();
  }

  if (start.textContent === 'Restart') {
    game.start();

    updateField();
    updateStatus();
  }
});

function updateStatus() {
  const messageStart = document.querySelector('.message-start');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const gameStatus = game.getStatus();

  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');

  if (gameStatus === 'playing') {
    messageStart.classList.add('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }
}

function move() {
  const score = document.querySelector('.game-score');

  updateField();
  updateStatus();
  score.textContent = game.getScore();
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      game.moveUp();
      move();
      break;
    case 'ArrowDown':
      e.preventDefault();
      game.moveDown();
      move();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      game.moveLeft();
      move();
      break;
    case 'ArrowRight':
      e.preventDefault();
      game.moveRight();
      move();
      break;
  }
});

function updateField() {
  const gameBoard = game.getState();
  const fieldCells = document.querySelectorAll('.field-cell');

  fieldCells.forEach((cellElement) => {
    Array.from(cellElement.classList).forEach((cls) => {
      if (cls.startsWith('field-cell--')) {
        cellElement.classList.remove(cls);
      }
    });
  });

  let cellIndex = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cellValue = gameBoard[r][c];
      const cellElement = fieldCells[cellIndex];

      if (cellValue !== 0) {
        cellElement.textContent = cellValue;
        cellElement.classList.add(`field-cell--${cellValue}`);
      } else {
        cellElement.textContent = '';
      }

      cellIndex++;
    }
  }
}
