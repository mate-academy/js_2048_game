'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

let debugMode = false;
const score = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');

const playingFieldCells = [
  ...document.querySelectorAll('.field-cell').values(),
];
const playingField = playingFieldCells.reduce(
  (matrix, cell, index) => {
    matrix[Math.floor(index / 4)][index % 4] = cell;

    return matrix;
  },
  [[], [], [], []],
);

playingField.forEach((row, rowIndex) => {
  row.forEach((element, columnIndex) => {
    element.addEventListener('click', () => {
      debugIncrementCell(rowIndex, columnIndex);
    });
  });
});

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startButton.classList.replace('start', 'restart');
    startButton.textContent = 'Restart';

    messageStart.classList.add('hidden');
  }

  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  game.restart();
  syncCellValues();
});

document.addEventListener('keydown', (event) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let needUpdate = true;

  switch (event.key) {
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'F6':
      debugMode = !debugMode;
      console.log(`debug mode: ${debugMode}`);
      needUpdate = false;
      break;
    default:
      needUpdate = false;
      break;
  }

  if (needUpdate) {
    syncCellValues();

    setTimeout(() => {
      game.populateRandomly(2);
      syncCellValues();

      switch (game.getStatus()) {
        case 'win':
          messageWin.classList.remove('hidden');
          break;
        case 'lose':
          messageLose.classList.remove('hidden');
          break;
      }
    }, 300);
  }
});

function syncCellValues() {
  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      const viewCell = playingField[row][column];
      const value = game.getCell(row, column);

      for (let n = 2; n <= 2048; n *= 2) {
        viewCell.classList.remove(`field-cell--${n}`);
      }

      if (value === 0) {
        viewCell.textContent = ``;
      } else {
        viewCell.textContent = `${value}`;
        viewCell.classList.add(`field-cell--${value}`);
      }
    }
  }

  score.textContent = game.getScore().toString();
}

function debugIncrementCell(row, column) {
  if (debugMode) {
    const n = game.getCell(row, column);

    if (n === 0) {
      game.setCell(row, column, 2);
    } else if (n === 2048) {
      game.setCell(row, column, 0);
    } else {
      game.setCell(row, column, n * 2);
    }

    syncCellValues();
  }
}
