'use strict';

// region variables
let board;
let score = 0;
const rows = 4;
const columns = 4;
let isFirstMove = true;
let isMoved = true;
let changed = {
  left: true,
  right: true,
  up: true,
  down: true,
};
const emptyBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startButton = document.querySelector('.start');
// endregion

window.onload = function() {
  setGame();
};

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      slideLeft();
      break;
    case 'ArrowRight':
      slideRight();
      break;
    case 'ArrowUp':
      slideUp();
      break;
    case 'ArrowDown':
      slideDown();
      break;
    default:
      break;
  }

  const isAnythingChanged = !!Object.values(changed)
    .filter(value => value).length;

  if (!isAnythingChanged && !isFreeSpace()) {
    loseMessage.classList.remove('hidden');
  }

  if (isMoved) {
    setTimeout(() => addNumber(), 300);
  }
});

startButton.addEventListener('click', e => {
  resetBoard();
  startGame();
});

// region main functions
const setGame = () => {
  board = emptyBoard;

  board.forEach((matrixRow, rowIndex) => {
    const htmlRow = document.createElement('tr');

    document.querySelector('.game-field').append(htmlRow);

    matrixRow.forEach((_, columnIndex) => {
      const htmlCell = document.createElement('td');
      const num = board[rowIndex][columnIndex];

      htmlCell.id = `${rowIndex}-${columnIndex}`;
      updateTile(htmlCell, num);
      htmlRow.append(htmlCell);
    });
  });
};

const startGame = () => {
  addNumber();
  addNumber();
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startButton.classList.replace('start', 'restart');
  startButton.innerHTML = 'Restart';
};

const resetBoard = () => {
  board = emptyBoard;

  board.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const tile = document.getElementById(`${rowIndex}-${columnIndex}`);

      updateTile(tile, 0);
    });
  });
};

const addNumber = () => {
  if (!isFreeSpace()) {
    return;
  }

  const rowIndex = Math.floor(Math.random() * rows);
  const columnIndex = Math.floor(Math.random() * columns);
  const cell = document.getElementById(`${rowIndex}-${columnIndex}`);
  const number = calculateProbabilityNumber();

  if (cell.innerText) {
    addNumber();

    return;
  }

  board[rowIndex][columnIndex] = number;
  updateTile(cell, number);
};

const updateTile = (cell, num) => {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (num > 0) {
    cell.innerText = num;

    if (num < 2048) {
      cell.classList.add(`field-cell--${num}`);
    } else {
      cell.classList.add(`field-cell--2048`);
    }
  }
};
// endregion

// region slide functions
const slide = (row, direction) => {
  if (isFirstMove) {
    isFirstMove = false;
    startGame();
  }

  isMoved = true;
  changed[direction] = false;

  let updatedRow = filterZero(row);

  updatedRow.forEach((cell, cellIndex) => {
    if (updatedRow[cellIndex] === updatedRow[cellIndex + 1]) {
      changed = {
        left: true,
        right: true,
        up: true,
        down: true,
      };
      updatedRow[cellIndex] *= 2;
      updatedRow[cellIndex + 1] = 0;
      score += updatedRow[cellIndex];
      document.querySelector('.game-score').innerHTML = score;

      if (updatedRow[cellIndex] === 2048) {
        winMessage.classList.remove('hidden');
      }
    }
  });

  updatedRow = filterZero(updatedRow);

  while (updatedRow.length < columns) {
    updatedRow.push(0);
  }

  const isSame = updatedRow.every(
    (cell, cellIndex) => cell === row[cellIndex]);

  if (isSame && !filterZero(row).length) {
    isMoved = false;
  }

  return updatedRow;
};

const slideLeft = () => {
  for (let r = 0; r < rows; r++) {
    board[r] = slide(board[r], 'left');

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateTile(cell, num);
    }
  }
};

const slideRight = () => {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row, 'right');
    row.reverse();

    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateTile(cell, num);
    }
  }
};

const slideUp = () => {
  for (let c = 0; c < columns; c++) {
    let row = [];

    row.length = rows;
    row.fill(0);

    row.forEach((_, index) => {
      row[index] = board[index][c];
    });

    row = slide(row, 'up');

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const cell = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateTile(cell, num);
    }
  }
};

const slideDown = () => {
  for (let c = 0; c < columns; c++) {
    let row = [];

    row.length = rows;
    row.fill(0);

    row.forEach((_, index) => {
      row[index] = board[index][c];
    });

    row.reverse();
    row = slide(row, 'down');
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const cell = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateTile(cell, num);
    }
  }
};
// endregion

// region utility functions
const isFreeSpace = () => {
  return board.some((row) => row.some(cell => cell === 0));
};

const calculateProbabilityNumber = () => {
  return Math.random() > 0.9 ? 4 : 2;
};

const filterZero = (row) => {
  return row.filter(num => num !== 0);
};
// endregion
