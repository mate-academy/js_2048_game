/* eslint-disable no-console */
'use strict';

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// eslint-disable-next-line no-unused-vars, prefer-const
let score = 0;

function placeRandomNumber() {
  const emptyCells = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        emptyCells.push([row, col]);
      }
    }
  }

  const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  board[x][y] = Math.random() < 0.9 ? 2 : 4;
}

placeRandomNumber();
placeRandomNumber();

console.log(board, ': numbers board');

function updateBoard() {
  const rows = document.querySelectorAll('.field-row');

  // loop through each row
  rows.forEach((row, i) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, j) => {
      // Clear the cell's text content and remove additional classes
      cell.textContent = '';
      cell.className = 'field-cell';

      const value = board[i][j];

      console.log(value, ': current values');

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });
}

updateBoard();
