'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const score = document.querySelector('.game-score');
const button = document.querySelector('.button');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

button.addEventListener('click', () => {
  if (button.classList.contains('restart')) {
    game.restart();
  }

  game.start();
  updateUi();
  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  button.className = 'button restart';
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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

  updateUi();
});

function updateUi() {
  const curState = game.getState();
  const curStatus = game.getStatus();
  const boardRows = document.querySelectorAll('.field-row');

  boardRows.forEach((row, rowIndex) => {
    const rowCells = [...row.cells];

    rowCells.forEach((cell, cellIndex) => {
      const cellValue = curState[rowIndex][cellIndex];

      cell.textContent = cellValue || '';
      cell.className = 'field-cell';

      if (cellValue > 0) {
        cell.classList.add(`field-cell--${cellValue}`);
      }
    });
  });

  score.textContent = game.getScore();

  if (curStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  } else if (curStatus === 'win') {
    winMessage.classList.remove('hidden');
  }
}
