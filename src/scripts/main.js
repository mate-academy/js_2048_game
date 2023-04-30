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

document.addEventListener('keyup', type => {
  switch (startBtn.classList.contains('restart')) {
    case type.code === 'ArrowLeft':
      moveLeft();
      setNewCell();
      break;

    case type.code === 'ArrowRight':
      moveRight();
      setNewCell();
      break;

    case type.code === 'ArrowUp':
      moveUp();
      setNewCell();
      break;

    case type.code === 'ArrowDown':
      moveDown();
      setNewCell();
      break;
  }

  if (!checkIfPossible()) {
    checkIfLose();
  }
});

function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (num > 0) {
    cell.innerText = String(num);
    cell.classList.add(`field-cell--${String(num)}`);
  }
}

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

function checkIfEmpty() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (field[row][col] === 0) {
        return true;
      }
    }
  }

  return false;
}

function setNewCell() {
  if (!checkIfEmpty()) {
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

function move(row) {
  let newRow = filterRow(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (newRow[i] === newRow[i + 1] && isFinite(newRow[i])) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
      checkIfWin(newRow[i]);
    }
  }

  newRow = filterRow(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
}

function moveLeft() {
  for (let r = 0; r < rows; r++) {
    let row = field[r];

    row = move(row);
    field[r] = row;
  }

  updateGame();
}

function moveRight() {
  for (let r = 0; r < rows; r++) {
    let row = field[r];

    row.reverse();
    row = move(row);
    row.reverse();
    field[r] = row;
  }

  updateGame();
}

function moveUp() {
  for (let col = 0; col < columns; col++) {
    let row = [field[0][col], field[1][col], field[2][col], field[3][col]];

    row = move(row);

    for (let i = 0; i < columns; i++) {
      field[i][col] = row[i];
    }
  }

  updateGame();
}

function moveDown() {
  for (let col = 0; col < columns; col++) {
    let row = [field[0][col], field[1][col], field[2][col], field[3][col]];

    row.reverse();
    row = move(row);
    row.reverse();

    for (let i = 0; i < columns; i++) {
      field[i][col] = row[i];
    }
  }

  updateGame();
}

function checkIfPossible() {
  let check = false;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (row < 3) {
        if (field[row][col] === field[row + 1][col]
          || field[row][col] === field[row][col + 1]) {
          check = true;
        }
      }
    }
  }

  if (!check && !checkIfEmpty()) {
    return false;
  }

  return true;
}

function checkIfWin(value) {
  if (value === 2048) {
    messageWin.classList.remove('hidden');
    startBtn.classList.remove('restart');
    startBtn.innerText = 'Start';
  }
}

function checkIfLose() {
  messageLose.classList.remove('hidden');
  startBtn.classList.remove('restart');
  startBtn.innerText = 'Start';
}
