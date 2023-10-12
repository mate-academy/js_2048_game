'use strict';

const rows = 4;
const columns = 4;
let feild = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let score = 0;

const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const button = document.querySelector('.button');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

button.addEventListener('click', start);

function start() {
  feild = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.add('hidden');
  button.classList.replace('start', 'restart');
  button.innerText = 'Restart';

  addRandomValue();
  addRandomValue();
}

function addRandomValue() {
  const value = Math.random() < 0.9 ? 2 : 4;

  while (hasSpace()) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (feild[r][c] === 0) {
      feild[r][c] = value;
      break;
    }
  }

  updateCells();
}

function hasSpace() {
  for (let r = 0; r < rows; r++) {
    if (feild[r].includes(0)) {
      return true;
    }
  }

  return false;
}

function updateCells() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = gameField.rows[r].cells[c];
      const value = feild[r][c];

      cell.innerText = '';
      cell.className = 'field-cell';

      if (value > 0) {
        cell.innerText = value;
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  isWin();
  updateScore();

  if (isLost()) {
    loseMessage.classList.remove('hidden');
  }
}

function isWin() {
  if (feild.some(arr => arr.some(cell => cell === 2048))) {
    winMessage.classList.remove('hidden');
  }

  return false;
}

function updateScore() {
  gameScore.innerText = score;
}

function isLost() {
  if (hasSpace()) {
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (feild[r][c] === feild[r][c + 1]) {
        return false;
      }
    }
  }

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < columns; c++) {
      if (feild[r][c] === feild[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

function hasChangedField(currentField, copyField) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (currentField[r][c] !== copyField[r][c]) {
        return true;
      }
    }
  }

  return false;
}

function move(row) {
  let rowWithoutZeros = row.filter(el => el !== 0);

  for (let i = 0; i < rows - 1; i++) {
    if (rowWithoutZeros[i] === rowWithoutZeros[i + 1]
      && isFinite(rowWithoutZeros[i])) {
      rowWithoutZeros[i] *= 2;
      rowWithoutZeros[i + 1] = 0;
      score += rowWithoutZeros[i];
    }
  }

  rowWithoutZeros = rowWithoutZeros.filter(el => el !== 0);

  while (rowWithoutZeros.length < rows) {
    rowWithoutZeros.push(0);
  }

  return rowWithoutZeros;
}

function moveUp() {
  for (let c = 0; c < columns; c++) {
    let row = [feild[0][c], feild[1][c],
      feild[2][c], feild[3][c]];

    row = move(row);

    for (let r = 0; r < rows; r++) {
      feild[r][c] = row[r];
    }
  }
}

function moveRight() {
  for (let r = 0; r < rows; r++) {
    let row = feild[r];

    row = row.reverse();

    row = move(row);

    row = row.reverse();

    feild[r] = row;
  }
}

function moveDown() {
  for (let c = 0; c < columns; c++) {
    let row = [feild[0][c], feild[1][c],
      feild[2][c], feild[3][c]];

    row = row.reverse();

    row = move(row);

    row = row.reverse();

    for (let r = 0; r < rows; r++) {
      feild[r][c] = row[r];
    }
  }
}

function moveLeft() {
  for (let r = 0; r < rows; r++) {
    let row = feild[r];

    row = move(row);

    feild[r] = row;
  }
}

document.addEventListener('keyup', e => {
  const copyField = feild.map(arr => arr.slice());

  e.preventDefault();

  switch (e.code) {
    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowDown':
      moveDown();
      break;

    case 'ArrowLeft':
      moveLeft();
      break;
  }

  if (hasChangedField(feild, copyField)) {
    addRandomValue();
  }

  updateCells();
});
