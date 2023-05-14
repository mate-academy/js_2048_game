'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;
let isFirstMove = true;
let changed = {
  left: true,
  right: true,
  up: true,
  down: true,
};

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startButton = document.querySelector('.start');

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

    return;
  }
  setTimeout(() => addNumber(), 300);
});

startButton.addEventListener('click', e => {
  resetBoard();
  startGame();
});

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
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  board.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const tile = document.getElementById(`${rowIndex}-${columnIndex}`);

      updateTile(tile, 0);
    });
  });
};

const setGame = () => {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    const row = document.createElement('tr');

    document.querySelector('.game-field').append(row);

    for (let c = 0; c < columns; c++) {
      const cell = document.createElement('td');
      const num = board[r][c];

      cell.id = `${r}-${c}`;
      updateTile(cell, num);
      row.append(cell);
    }
  }
};

const isFreeSpace = () => {
  return board.some((row) => row.some(cell => cell === 0));
};

const calculateProbabilityNumber = () => {
  return Math.random() > 0.9 ? 4 : 2;
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

const filterZero = (row) => {
  return row.filter(num => num !== 0);
};

// region slide functions
const slide = (row, direction) => {
  if (isFirstMove) {
    isFirstMove = false;
    startGame();
  }

  let updatedRow = filterZero(row);

  changed[direction] = false;

  for (let i = 0; i < updatedRow.length - 1; i++) {
    if (updatedRow[i] === updatedRow[i + 1]) {
      changed = {
        left: true,
        right: true,
        up: true,
        down: true,
      };
      updatedRow[i] *= 2;
      updatedRow[i + 1] = 0;
      score += updatedRow[i];
      document.querySelector('.game-score').innerHTML = score;

      if (updatedRow[i] === 2048) {
        winMessage.classList.remove('hidden');
      }
    }
  }

  updatedRow = filterZero(updatedRow);

  while (updatedRow.length < columns) {
    updatedRow.push(0);
  }

  return updatedRow;
};

const slideLeft = () => {
  for (let r = 0; r < rows; r++) {
    const row = slide(board[r], 'left');

    board[r] = row;

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
      row.push(board[index][c]);
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
      row.push(board[index][c]);
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
