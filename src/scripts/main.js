'use strict';

const startBtn = document.querySelector('.start');
const fieldRows = document.querySelector('tbody').rows;
const scoreBoard = document.querySelector('.game-score');

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

  updateTheGame();
  setNewCell();
  setNewCell();

  startBtn.classList.add('restart');
  startBtn.innerText = 'Restart';

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
});

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

      updateTheGame();
    }
  }
}

function updateTheGame() {
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

document.addEventListener('keyup', e => {
  if (startBtn.classList.contains('restart')) {
    switch (e.code) {
      case 'ArrowLeft':
        slideLeft();
        setNewCell();
        break;

      case 'ArrowRight':
        slideRight();
        setNewCell();
        break;

      case 'ArrowUp':
        slideUp();
        setNewCell();
        break;

      case 'ArrowDown':
        slideDown();
        setNewCell();
        break;
    }
  }

  if (!checkIfPossible()) {
    checkIfLose();
  }
});

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
      checkIfWin(newRow[i]);
    }
  }
  newRow = filterRow(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
}

function checkIfWin(value) {
  if (value === 2048) {
    messageWin.classList.remove('hidden');
    startBtn.classList.remove('restart');
    startBtn.innerText = 'Start';
  }
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = field[r];

    row = slide(row);
    field[r] = row;
  }

  updateTheGame();
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = field[r];

    row.reverse();
    row = slide(row);
    row.reverse();
    field[r] = row;
  }
  updateTheGame();
}

function slideUp() {
  for (let col = 0; col < columns; col++) {
    let row = [field[0][col], field[1][col], field[2][col], field[3][col]];

    row = slide(row);

    for (let i = 0; i < columns; i++) {
      field[i][col] = row[i];
    }
  }
  updateTheGame();
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

  updateTheGame();
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

function checkIfLose() {
  messageLose.classList.remove('hidden');
  startBtn.classList.remove('restart');
  startBtn.innerText = 'Start';
}
