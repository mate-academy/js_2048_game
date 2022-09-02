'use strict';

const fieldRows = document.querySelector('tbody').rows;
const scoreBoard = document.querySelector('.game-score');
const startBtn = document.querySelector('.start');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const rows = 4;
const columns = 4;
let score = 0;

let field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

startBtn.addEventListener('click', () => {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;

  updateGame();
  setNewCell();
  setNewCell();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  startBtn.classList.add('restart');
  startBtn.innerText = 'Restart';
});

document.addEventListener('keyup', (type) => {
  if (startBtn.classList.contains('restart')) {
    if (type.code === 'ArrowLeft') {
      slideLeft();
      setNewCell();
    }

    if (type.code === 'ArrowRight') {
      slideRight();
      setNewCell();
    }

    if (type.code === 'ArrowUp') {
      slideUp();
      setNewCell();
    }

    if (type.code === 'ArrowDown') {
      slideDown();
      setNewCell();
    }
  }

  if (!isPossible()) {
    isLose();
  }
});

function updateGame() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const currentCell = fieldRows[row].cells[col];
      const num = field[row][col];

      updateCell(currentCell, num);
    }
  }

  scoreBoard.innerText = String(score);
}

function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (num > 0) {
    cell.innerText = String(num);
    cell.classList.add(`field-cell--${String(num)}`);
  }
}

function isEmpty() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (field[row][col] === 0) {
        return true;
      }
    }
  }

  return false;
}

function isPossible() {
  let check = false;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (row < 3) {
        if (field[row][col] === field[row + 1][col]
          || field[row][col] === field[row][col + 1]) {
          check = true;
        }
      } else {
        if (field[row][col] === field[row][col + 1]) {
          check = true;
        }
      }
    }
  }

  if (!check && !isEmpty()) {
    return false;
  }

  return true;
}

function setNewCell() {
  if (!isEmpty()) {
    return;
  }

  const value = Math.random() > 0.1 ? 2 : 4;

  let check = false;

  while (!check) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * columns);

    if (field[row][col] === 0) {
      field[row][col] = value;
      check = true;

      updateGame();
    }
  }
}

function filterRow(row) {
  return row.filter(el => el !== 0);
}

function slide(row) {
  let newRow = filterRow(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (newRow[i] === newRow[i + 1] && isFinite(newRow[i])) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
      isWin(newRow[i]);
    }
  }

  newRow = filterRow(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = field[r];

    row = slide(row);
    field[r] = row;
  }

  updateGame();
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = field[r];

    row.reverse();
    row = slide(row);
    row.reverse();
    field[r] = row;
  }

  updateGame();
}

function slideUp() {
  for (let col = 0; col < columns; col++) {
    let row = [field[0][col], field[1][col], field[2][col], field[3][col]];

    row = slide(row);

    for (let i = 0; i < columns; i++) {
      field[i][col] = row[i];
    }
  }

  updateGame();
}

function slideDown() {
  for (let col = 0; col < columns; col++) {
    let row = [field[0][col], field[1][col], field[2][col], field[3][col]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let i = 0; i < columns; i++) {
      field[i][col] = row[i];
    }
  }

  updateGame();
}

function isWin(value) {
  if (value === 2048) {
    messageWin.classList.remove('hidden');
    startBtn.classList.remove('restart');
    startBtn.innerText = 'Start';
  }
}

function isLose() {
  messageLose.classList.remove('hidden');
  startBtn.classList.remove('restart');
  startBtn.innerText = 'Start';
}
