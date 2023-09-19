'use strict';

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;

function createTile(row, col, value) {
  const tile = document.createElement('div');

  tile.classList.add('tile');
  tile.classList.add(`tile--${value}`);
  tile.textContent = value;

  const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);

  cell.appendChild(tile);
}

function populateRandomCell() {
  const emptyCells = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        emptyCells.push([i, j]);
      }
    }
  }

  if (emptyCells.length > 0) {
    const [randRow, randCol]
      = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;

    board[randRow][randCol] = value;
    createTile(randRow, randCol, value);
  }
}

function initializeBoard() {
  const gameField = document.querySelector('.game-field');

  for (let i = 0; i < 4; i++) {
    const row = document.createElement('div');

    row.classList.add('row');

    for (let j = 0; j < 4; j++) {
      const cell = document.createElement('div');

      cell.classList.add('field-cell');
      cell.setAttribute('data-row', i);
      cell.setAttribute('data-col', j);
      row.appendChild(cell);
    }
    gameField.appendChild(row);
  }

  // Populate two random cells to start
  populateRandomCell();
  populateRandomCell();
}

// Call the function to initialize the board
initializeBoard();
