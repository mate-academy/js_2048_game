'use strict';

const FIELD_SIZE = 4;
const SCORE_TO_WIN = 2048;

const gameBoard = document.querySelector('.game-field');
const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const messageToStart = document.querySelector('.message-start');
const messageToWin = document.querySelector('.message-win');
const messageToLose = document.querySelector('.message-lose');

let score = 0;
let gameField = Array.from({ length: FIELD_SIZE }, () =>
  Array(FIELD_SIZE).fill(0)
);

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageToStart.classList.add('hidden');

    start();
  } else {
    start();

    messageToLose.classList.add('hidden');
    messageToWin.classList.add('hidden');
  }
});

function start() {
  gameField = Array.from({ length: FIELD_SIZE }, () =>
    Array(FIELD_SIZE).fill(0)
  );
  score = 0;
  gameScore.innerText = score;
  addRandomNumber();
  addRandomNumber();
};

function isEmptyCell() {
  for (let r = 0; r < FIELD_SIZE; r++) {
    if (gameField[r].includes(0)) {
      return true;
    };
  }

  return false;
}

function isAvaibleMoves() {
  if (isEmptyCell()) {
    return true;
  }

  for (let r = 0; r < FIELD_SIZE; r++) {
    for (let c = 0; c < FIELD_SIZE - 1; c++) {
      if (gameField[r][c] === gameField[r][c + 1]) {
        return true;
      }
    }
  }

  for (let r = 0; r < FIELD_SIZE - 1; r++) {
    for (let c = 0; c < FIELD_SIZE; c++) {
      if (gameField[r][c] === gameField[r + 1][c]) {
        return true;
      }
    }
  }

  return false;
}

function updateCells() {
  for (let x = 0; x < FIELD_SIZE; x++) {
    for (let y = 0; y < FIELD_SIZE; y++) {
      gameBoard.rows[x].cells[y].className = '';
      gameBoard.rows[x].cells[y].classList.add(`field-cell`);

      gameBoard
        .rows[x]
        .cells[y]
        .classList.add(`field-cell--${gameField[x][y]}`);
      gameBoard.rows[x].cells[y].textContent = gameField[x][y] || '';
    }
  }

  isWin();

  gameScore.innerText = score;

  if (!isAvaibleMoves()) {
    messageToLose.classList.remove('hidden');
  }
};

function addRandomNumber() {
  const randomNum = Math.random() < 0.9 ? 2 : 4;

  while (isEmptyCell()) {
    const r = Math.floor(Math.random() * FIELD_SIZE);
    const c = Math.floor(Math.random() * FIELD_SIZE);

    if (gameField[r][c] === 0) {
      gameField[r][c] = randomNum;
      break;
    }
  }

  updateCells();
}

function isWin() {
  if (gameField.some(arr => arr.some(cell => cell === SCORE_TO_WIN))) {
    messageToWin.classList.remove('hidden');
  }

  return false;
}

function move(row) {
  let rowWithoutZeros = row.filter(el => el !== 0);

  for (let i = 0; i < FIELD_SIZE - 1; i++) {
    if (rowWithoutZeros[i] === rowWithoutZeros[i + 1]
      && isFinite(rowWithoutZeros[i])) {
      rowWithoutZeros[i] *= 2;
      rowWithoutZeros[i + 1] = 0;
      score += rowWithoutZeros[i];
    }
  }

  rowWithoutZeros = rowWithoutZeros.filter(el => el !== 0);

  while (rowWithoutZeros.length < FIELD_SIZE) {
    rowWithoutZeros.push(0);
  }

  return rowWithoutZeros;
}

function moveUp() {
  for (let c = 0; c < FIELD_SIZE; c++) {
    let row = [
      gameField[0][c],
      gameField[1][c],
      gameField[2][c],
      gameField[3][c],
    ];

    row = move(row);

    for (let r = 0; r < FIELD_SIZE; r++) {
      gameField[r][c] = row[r];
    }
  }
}

function moveDown() {
  for (let c = 0; c < FIELD_SIZE; c++) {
    let row = [
      gameField[0][c],
      gameField[1][c],
      gameField[2][c],
      gameField[3][c],
    ];

    row = row.reverse();

    row = move(row);

    row = row.reverse();

    for (let r = 0; r < FIELD_SIZE; r++) {
      gameField[r][c] = row[r];
    }
  }
}

function moveLeft() {
  for (let r = 0; r < FIELD_SIZE; r++) {
    let row = gameField[r];

    row = move(row);

    gameField[r] = row;
  }
}

function moveRight() {
  for (let r = 0; r < FIELD_SIZE; r++) {
    let row = gameField[r];

    row = row.reverse();

    row = move(row);

    row = row.reverse();

    gameField[r] = row;
  }
}

function hasChanged(fieldCurent, fieldWithChange) {
  for (let r = 0; r < FIELD_SIZE; r++) {
    for (let c = 0; c < FIELD_SIZE; c++) {
      if (fieldCurent[r][c] !== fieldWithChange[r][c]) {
        return true;
      }
    }
  }

  return false;
}

document.addEventListener('keydown', e => {
  const copyField = gameField.map(arr => arr.slice());

  e.preventDefault();

  switch (e.code) {
    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      break;

    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;
  }

  if (hasChanged(gameField, copyField)) {
    addRandomNumber();
  }

  updateCells();
});
