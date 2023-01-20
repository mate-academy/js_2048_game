'use strict';

let gameField;
let score = 0;
const rows = 4;
const columns = 4;
const field = document.querySelector('tbody');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

button.addEventListener('click', () => {
  score = 0;
  document.querySelector('.game-score').innerText = score;

  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';
    startMessage.classList.add('hidden');
    setGame();
  } else {
    loseMessage.classList.add('hidden');
    setGame();
  }
});

document.addEventListener('keyup', (e) => {
  const previousField = [...gameField].toString();

  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    slideHorizontally(e.code);
  }

  if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
    transpose();
    slideHorizontally(e.code);
    transpose();
  }

  updateField();

  const currentField = [...gameField].toString();

  if (previousField !== currentField) {
    setNewNumber();
  }

  document.querySelector('.game-score').innerText = score;
});

function setGame() {
  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < columns; cell++) {
      const num = gameField[row][cell];

      updateCell(field.rows[row].cells[cell], num);
    }
  }

  setNewNumber();
  setNewNumber();
}

function setNewNumber() {
  if (!hasEmptyCell()) {
    return;
  }

  let found = false;

  while (!found) {
    const row = Math.floor(Math.random() * rows);
    const cell = Math.floor(Math.random() * columns);

    if (gameField[row][cell] === 0) {
      gameField[row][cell] = randomizeNumber();
      updateCell(field.rows[row].cells[cell], gameField[row][cell]);
      found = true;
    }
  }
}

function hasEmptyCell() {
  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < columns; cell++) {
      if (gameField[row][cell] === 0) {
        return true;
      }
    }
  }

  return false;
}

function randomizeNumber() {
  return Math.random() >= 0.9 ? 4 : 2;
}

function updateCell(fieldCell, num) {
  fieldCell.innerText = '';
  fieldCell.className = 'field-cell';
  fieldCell.classList.add(`field-cell--${num}`);

  if (num > 0) {
    fieldCell.innerText = num;
  } else {
    fieldCell.innerText = '';
  }

  if (!fieldCell.innerText) {
    fieldCell.className = 'field-cell';
  }

  setGameOver();
}

function mergeCells(row) {
  let newRow = row;

  newRow = filterZero(newRow);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];

      if (newRow[i] === 2048) {
        winMessage.classList.remove('hidden');
      }
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
}

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slideHorizontally(side) {
  for (let row = 0; row < rows; row++) {
    let newRow = gameField[row];

    if (side === 'ArrowLeft' || side === 'ArrowUp') {
      newRow = mergeCells(newRow);
    }

    if (side === 'ArrowRight' || side === 'ArrowDown') {
      newRow.reverse();
      newRow = mergeCells(newRow);
      newRow.reverse();
    }

    gameField[row] = newRow;
  }
}

function updateField() {
  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < columns; cell++) {
      const num = gameField[row][cell];

      updateCell(field.rows[row].cells[cell], num);
    }
  }
}

function transpose() {
  gameField = gameField[0].map((_, i) => gameField.map(newRow => newRow[i]));
}

function setGameOver() {
  const emptyCell = gameField.some(row => row.some(cell => !cell));

  if (emptyCell) {
    return;
  }

  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < columns - 1; cell++) {
      const isNextSame = gameField[row][cell] === gameField[row][cell + 1];
      const isBelowSame = gameField[cell][row] === gameField[cell + 1][row];

      if (isNextSame || isBelowSame) {
        return;
      }
    }
  }

  loseMessage.classList.remove('hidden');
}
