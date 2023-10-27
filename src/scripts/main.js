'use strict';

const START_BTN = document.querySelector('.button');
const RESTART_VALUE = 'Restart';
const START_MESSAGE = document.querySelector('.message-start');
const WIN_MESSAGE = document.querySelector('.message-win');
const LOSE_MESSAGE = document.querySelector('.message-lose');
const SCORE = document.querySelector('.game-score');

const ROW = document.querySelectorAll('.field-row');

const ARROW = {
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
};

const WIN_VALUE = 2048;
const ROWS = 4;
const COLUMNS = 4;

let board = [];
let score = 0;
let lose = false;
let won = false;

function deleteZeros(item) {
  return item.filter(cell => cell !== 0);
}

function transposeMatrix(arr, columnCount, rowsCount) {
  const tempArr = [];

  for (let column = 0; column < columnCount; column++) {
    const col = [];

    for (let row = 0; row < rowsCount; row++) {
      col.push(arr[row][column]);
    }
    tempArr.push(col);
  }

  return tempArr;
}

function loseGame() {
  lose = true;
  LOSE_MESSAGE.classList.remove('hidden');
}

function wonGame() {
  won = true;
  WIN_MESSAGE.classList.remove('hidden');
}

function setNewCell() {
  let trigger = true;
  const number = Math.random() < 0.9 ? 2 : 4;

  while (trigger) {
    const row = Math.floor(Math.random() * ROWS);
    const column = Math.floor(Math.random() * COLUMNS);

    if (board[row][column] === 0) {
      board[row][column] = number;
      trigger = false;
    }
  }
}

function updateBoard() {
  let countOfCells = 16;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const cell = ROW[i].children[j];
      const cellValue = board[i][j];

      if (cellValue) {
        cell.textContent = cellValue;
        cell.className = 'field-cell';
        cell.classList.add(`field-cell--${cellValue}`);

        if (cellValue === WIN_VALUE) {
          wonGame();
        }

        countOfCells--;
      } else {
        cell.textContent = '';
        cell.className = 'field-cell';
      }
      SCORE.textContent = score;
    }
  }

  if (!countOfCells) {
    loseGame();
  }
}

function initGame() {
  START_MESSAGE.classList.add('hidden');
  LOSE_MESSAGE.classList.add('hidden');
  WIN_MESSAGE.classList.add('hidden');
  SCORE.textContent = 0;

  lose = false;
  won = false;
  score = 0;

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const cell = ROW[i].children[j];

      cell.textContent = '';
      cell.className = 'field-cell';
    }
  }

  setNewCell();
  setNewCell();
  updateBoard();
}

function moveUp() {
  const matrix = transposeMatrix(board, COLUMNS, ROWS);
  const tempBoard = [];

  matrix.forEach(col => {
    const column = deleteZeros(col);

    for (let i = 0; i < column.length; i++) {
      if (column[i] === column[i + 1]) {
        column[i] *= 2;
        score += column[i];
        column[i + 1] = 0;
      }
    }

    while (column.length < ROWS) {
      column.push(0);
    }

    tempBoard.push(column);
  });

  board = transposeMatrix(tempBoard, COLUMNS, ROWS);
}

function moveRight() {
  const tempBoard = [];

  board.forEach(item => {
    const row = deleteZeros(item);

    for (let i = row.length - 1; i >= 0; i--) {
      if (row[i] === row[i - 1]) {
        row[i] *= 2;
        score += row[i];
        row[i - 1] = 0;
      }
    }

    while (row.length < ROWS) {
      row.unshift(0);
    }

    tempBoard.push(row);
  });

  board = tempBoard;
}

function moveDown() {
  const matrix = transposeMatrix(board, COLUMNS, ROWS);
  const tempBoard = [];

  matrix.forEach(item => {
    const column = deleteZeros(item);

    for (let i = column.length - 1; i >= 0; i--) {
      if (column[i] === column[i - 1]) {
        column[i] *= 2;
        score += column[i];
        column[i - 1] = 0;
      }
    }

    while (column.length < ROWS) {
      column.unshift(0);
    }

    tempBoard.push(column);
  });

  board = transposeMatrix(tempBoard, COLUMNS, ROWS);
}

function moveLeft() {
  const tempBoard = [];

  board.forEach(item => {
    const row = deleteZeros(item);

    for (let i = 0; i < row.length; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        score += row[i];
        row[i + 1] = 0;
      }
    }

    while (row.length < ROWS) {
      row.push(0);
    }

    tempBoard.push(row);
  });

  board = tempBoard;
}

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  if (lose || won) {
    return;
  }

  switch (e.key) {
    case ARROW.UP:
      moveUp();
      break;

    case ARROW.DOWN:
      moveDown();
      break;

    case ARROW.RIGHT:
      moveRight();
      break;

    case ARROW.LEFT:
      moveLeft();
      break;

    default:
      return;
  };

  setNewCell();
  updateBoard();
});

START_BTN.addEventListener('click', () => {
  if (START_BTN.classList.contains('start')) {
    START_BTN.textContent = RESTART_VALUE;
    START_BTN.classList.add('restart');
    START_BTN.classList.remove('start');
    START_MESSAGE.classList.add('hidden');
  }

  initGame();
});
