'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

// Write your code here
const rows = 4;
const columns = 4;

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');

const createCellMap = () => {
  const cellsList = [];
  const rowsList = document.querySelectorAll('.game-field .field-row');

  rowsList.forEach((rowElement, r) => {
    const rowCells = [];
    const cellElements = rowElement.querySelectorAll('.field-cell');

    cellElements.forEach((cellElement, c) => {
      rowCells.push(cellElement);
    });

    cellsList.push(rowCells);
  });

  return cellsList;
};

const cells = createCellMap();

const updateUI = () => {
  score.textContent = game.getScore();

  const board = game.getState();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const value = board[r][c];
      const cell = cells[r][c];

      cell.className = '';
      cell.classList.add('field-cell');

      if (value) {
        cell.innerText = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.innerText = '';
      }
    }
  }

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
};

const handleMove = (keyboard) => {
  switch (keyboard) {
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
  updateUI();
};

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Reset';
    startMessage.classList.add('hidden');
    game.start();
  } else {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    startMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');

    game.restart();
  }

  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
    handleMove(e.key);
  }
});
