'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const startMessage = document.querySelector('.message-start');
const button = document.querySelector('.button');
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

button.addEventListener('click', () => {
  if (button.className === 'button restart') {
    game.restart();
  }

  game.start();
  updateUi();
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.add('hidden');
  button.textContent = 'Restart';
  button.className = 'button restart';
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
  }
  updateUi();
});

function updateUi() {
  const currentState = game.getState();
  const currentStatus = game.getStatus();
  const boardRows = gameField.querySelectorAll('.field-row');

  boardRows.forEach((row, rowIndex) => {
    const rowCells = row.querySelectorAll('.field-cell');

    rowCells.forEach((cell, colIndex) => {
      const cellValue = currentState[rowIndex][colIndex];

      cell.innerHTML = cellValue || '';
      cell.className = 'field-cell';

      if (cellValue > 0) {
        cell.classList.add(`field-cell--${cellValue}`);
      }
    });
  });

  gameScore.textContent = game.getScore();

  if (currentStatus === 'win') {
    winMessage.classList.remove('hidden');
  } else if (currentStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}
