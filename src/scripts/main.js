'use strict';

let score = 0;
const rows = 4;
const columns = 4;
let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const table = document.querySelector('.game-field');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');

button.addEventListener('click', start);

function hasFieldChanged(currentField, fieldCopy) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (currentField[r][c] !== fieldCopy[r][c]) {
        return true;
      }
    }
  }

  return false;
}

function hasSpace() {
  for (let r = 0; r < rows; r++) {
    if (gameField[r].includes(0)) {
      return true;
    }
  }

  return false;
}

function addRandomValue() {
  const value = Math.floor(Math.random()) < 0.9 ? 2 : 4;

  while (hasSpace()) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (gameField[r][c] === 0) {
      gameField[r][c] = value;
      break;
    }
  }

  updateCells();
}

function start() {
  score = 0;

  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  winMessage.classList.add('hidden');
  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  button.classList.replace('start', 'restart');
  button.innerText = 'Restart';

  addRandomValue();
  addRandomValue();
}

function isLost() {
  if (hasSpace()) {
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (gameField[r][c] === gameField[r][c + 1]) {
        return false;
      }
    }
  }

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < columns; c++) {
      if (gameField[r][c] === gameField[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

function isWin() {
  if (gameField.some(row => row.some(cell => cell === 2048))) {
    winMessage.classList.remove('hidden');
  }
}

function updateScore() {
  gameScore.innerHTML = score;
}

function updateCells() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = table.rows[r].cells[c];
      const value = gameField[r][c];

      cell.innerText = '';
      cell.classList.value = '';
      cell.classList.add('field-cell');

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
    let row = [gameField[0][c], gameField[1][c],
      gameField[2][c], gameField[3][c]];

    row = move(row);

    for (let r = 0; r < rows; r++) {
      gameField[r][c] = row[r];
    }
  }
}

function moveDown() {
  for (let c = 0; c < columns; c++) {
    let row = [gameField[0][c], gameField[1][c],
      gameField[2][c], gameField[3][c]];

    row.reverse();
    row = move(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      gameField[r][c] = row[r];
    }
  }
}

function moveRight() {
  for (let r = 0; r < rows; r++) {
    let row = gameField[r];

    row.reverse();
    row = move(row);
    row.reverse();
    gameField[r] = row;
  }
}

function moveLeft() {
  for (let r = 0; r < rows; r++) {
    let row = gameField[r];

    row = move(row);
    gameField[r] = row;
  }
}

document.addEventListener('keyup', e => {
  const fieldCopy = gameField.map(arr => arr.slice());

  e.preventDefault();

  switch (e.code) {
    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      break;
  }

  if (hasFieldChanged(gameField, fieldCopy)) {
    addRandomValue();
  }

  updateCells();
});
