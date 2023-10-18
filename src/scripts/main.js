'use strict';

const mainButton = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');
const field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let startGame = false;
const rows = 4;
const cellsInRow = 4;
let score = 0;
let isWon;

mainButton.addEventListener('click', () => {
  if (mainButton.classList.contains('start')) {
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
    mainButton.textContent = 'Restart';
    startMessage.classList.add('hidden');
    isWon = false;
    startGame = true;
    generateRandomCell();
    generateRandomCell();
  } else {
    mainButton.classList.remove('restart');
    mainButton.classList.add('start');
    mainButton.textContent = 'Start';
    startMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    clearField();
    gameScore.textContent = '0';
    startGame = false;
  }
});

document.addEventListener('keydown', (e) => {
  if (isWon || !startGame) {
    return;
  }

  if (e.key === 'w' || e.key === 'ArrowUp') {
    const fieldCopy = makeFieldCopy();

    goUp();

    if (!fieldsEqual(fieldCopy)) {
      generateRandomCell();
    }
  }

  if (e.key === 'a' || e.key === 'ArrowLeft') {
    const fieldCopy = makeFieldCopy();

    goLeft();

    if (!fieldsEqual(fieldCopy)) {
      generateRandomCell();
    }
  }

  if (e.key === 'd' || e.key === 'ArrowRight') {
    const fieldCopy = makeFieldCopy();

    goRight();

    if (!fieldsEqual(fieldCopy)) {
      generateRandomCell();
    }
  }

  if (e.key === 's' || e.key === 'ArrowDown') {
    const fieldCopy = makeFieldCopy();

    goDown();

    if (!fieldsEqual(fieldCopy)) {
      generateRandomCell();
    }
  }
  gameScore.textContent = score;
});

function updateCell(cell, value) {
  cell.textContent = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (value > 0) {
    cell.textContent = value;
    cell.classList.add(`field-cell--${value}`);
  }

  if (value === 2048) {
    winMessage.classList.remove('hidden');
    isWon = true;
  }

  if (lost()) {
    loseMessage.classList.remove('hidden');
  }
}

function updateVertical(i, column) {
  for (let j = 0; j < rows; j++) {
    field[j][i] = column[j];

    const value = field[j][i];
    const cell = document.getElementById(`${j}-${i}`);

    updateCell(cell, value);
  }
}

function updateHorizontal(i) {
  for (let j = 0; j < cellsInRow; j++) {
    const value = field[i][j];
    const cell = document.getElementById(`${i}-${j}`);

    updateCell(cell, value);
  }
}

function goUp() {
  for (let i = 0; i < cellsInRow; i++) {
    let column = [field[0][i], field[1][i], field[2][i], field[3][i]];

    column = mergeCells(column);
    updateVertical(i, column);
  }
}

function goDown() {
  for (let i = 0; i < cellsInRow; i++) {
    let column = [field[0][i], field[1][i], field[2][i], field[3][i]];

    column.reverse();
    column = mergeCells(column);
    column.reverse();
    updateVertical(i, column);
  }
}

function goLeft() {
  for (let i = 0; i < rows; i++) {
    field[i] = mergeCells(field[i]);
    updateHorizontal(i);
  }
}

function goRight() {
  for (let i = 0; i < rows; i++) {
    field[i].reverse();
    field[i] = mergeCells(field[i]);
    field[i].reverse();
    updateHorizontal(i);
  }
}

function mergeCells(row) {
  let clearedRow = clearRow(row);

  for (let i = 1; i < clearedRow.length; i++) {
    if (clearedRow[i - 1] === clearedRow[i]) {
      clearedRow[i - 1] *= 2;
      clearedRow[i] = 0;
      score += clearedRow[i - 1];
    }
  }

  clearedRow = clearRow(clearedRow);

  while (clearedRow.length < cellsInRow) {
    clearedRow.push(0);
  }

  return clearedRow;
}

function clearRow(row) {
  return row.filter((cell) => cell > 0);
}

function generate2or4() {
  const randValue = Math.random();

  if (randValue <= 0.1) {
    return 4;
  } else {
    return 2;
  }
}

function generateRandomCell() {
  if (!hasEmptyCells()) {
    return;
  }

  let found = false;

  while (!found) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCell = Math.floor(Math.random() * cellsInRow);

    if (field[randomRow][randomCell] === 0) {
      const value = generate2or4();

      field[randomRow][randomCell] = value;

      const cell = document.getElementById(`${randomRow}-${randomCell}`);

      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
      found = true;
    }
  }
}

function hasEmptyCells() {
  for (const row of field) {
    for (const cell of row) {
      if (cell === 0) {
        return true;
      }
    }
  }

  return false;
}

function makeFieldCopy() {
  return field.map((row) => [...row]);
}

function fieldsEqual(fieldCopy) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cellsInRow; j++) {
      if (field[i][j] !== fieldCopy[i][j]) {
        return false;
      }
    }
  }

  return true;
}

function clearField() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cellsInRow; j++) {
      if (field[i][j] !== 0) {
        field[i][j] = 0;
      }
    }
    updateHorizontal(i);
  }
  score = 0;
}

function lost() {
  if (hasEmptyCells()) {
    return false;
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rows; j++) {
      if (field[i][j] === field[i][j + 1]) {
        return false;
      }
    }
  }

  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < rows; j++) {
      if (field[i][j] === field[i + 1][j]) {
        return false;
      }
    }
  }

  return true;
}
