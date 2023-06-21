'use strict';

const rowsNum = 4;
const columnsNum = 4;
let handler = false;
let score = 0;
let best = 0;

const field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const cells = document.querySelectorAll('.field-cell');
const rows = document.querySelectorAll('.field-row');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const counter = document.querySelector('.game-score');
const bestResult = document.querySelector('.game-best');

const filterZero = (row) => row.filter(el => el !== 0);
const hasEmptyCell = () => field.some(row => row.some(el => el === 0));
const checkWin = () => field.some(row => row.some(el => el === 2048));
const random = () => Math.floor(Math.random() * 4);

function hasAdjacentTiles() {
  for (let i = 0; i < rowsNum; i++) {
    for (let j = 0; j < columnsNum; j++) {
      if (j < columnsNum - 1 && field[i][j] === field[i][j + 1]) {
        return true;
      }

      if (i < rowsNum - 1 && field[i][j] === field[i + 1][j]) {
        return true;
      }
    }
  }

  return false;
}

function generateRandomNum() {
  if (!hasEmptyCell()) {
    return;
  }

  let rowIndex, cellIndex;

  do {
    rowIndex = random();
    cellIndex = random();
  } while (field[rowIndex][cellIndex] !== 0);

  if (field[rowIndex][cellIndex] === 0) {
    const value = Math.random() < 0.9 ? 2 : 4;
    const cell = rows[rowIndex].children[cellIndex];

    field[rowIndex][cellIndex] = value;
    cell.textContent = value;
    cell.classList.add(`field-cell--${value}`);
  }
}

function updateTable() {
  cells.forEach(el => {
    el.textContent = '';
    el.className = 'field-cell';
  });

  for (let i = 0; i < field.length; i++) {
    for (let k = 0; k < field[i].length; k++) {
      const cell = rows[i].children[k];
      const value = field[i][k];

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  counter.textContent = score;
  bestResult.textContent = best;
}

function slide(row) {
  let copy = [...row];

  copy = filterZero(copy);

  for (let i = 0; i < copy.length - 1; i++) {
    if (copy[i] === copy[i + 1]) {
      copy[i] *= 2;
      copy[i + 1] = 0;
      score += copy[i];
    }
  }

  copy = filterZero(copy);

  while (copy.length < columnsNum) {
    copy.push(0);
  }

  return copy;
}

function slideLeft() {
  for (let i = 0; i < rowsNum; i++) {
    let row = field[i];

    row = slide(row);
    field[i] = row;
  }
}

function slideRight() {
  for (let i = 0; i < rowsNum; i++) {
    let row = field[i];

    row.reverse();
    row = slide(row);
    row.reverse();
    field[i] = row;
  }
}

function fieldCombine(cell, num, row) {
  for (let r = 0; r <= num; r++) {
    field[r][cell] = row[r];
  }
}

function slideUp() {
  for (let i = 0; i < columnsNum; i++) {
    let row = [field[0][i], field[1][i], field[2][i], field[3][i]];

    row = slide(row);
    fieldCombine(i, 3, row);
  }
}

function slideDown() {
  for (let i = 0; i < columnsNum; i++) {
    let row = [field[0][i], field[1][i], field[2][i], field[3][i]];

    row.reverse();
    row = slide(row);
    row.reverse();
    fieldCombine(i, 3, row);
  }
}

button.addEventListener('click', () => {
  if (!button.classList.contains('restart')) {
    button.className = 'button restart';
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    field.forEach(el => el.fill(0));

    if (score > best) {
      best = score;
      score = 0;
    }

    score = 0;
    updateTable();
    messageLose.classList.add('hidden');
  }

  handler = true;

  generateRandomNum();
  generateRandomNum();
});

document.addEventListener('keydown', (e) => {
  if (handler) {
    e.preventDefault();

    switch (e.key) {
      case 'ArrowLeft':
        slideLeft();
        generateRandomNum();
        break;
      case 'ArrowRight':
        slideRight();
        generateRandomNum();
        break;
      case 'ArrowUp':
        slideUp();
        generateRandomNum();
        break;
      case 'ArrowDown':
        slideDown();
        generateRandomNum();
        break;
    }

    updateTable();

    if (checkWin()) {
      messageWin.classList.remove('hidden');
      handler = false;
    }

    if (!hasEmptyCell() && !hasAdjacentTiles()) {
      messageLose.classList.remove('hidden');
      handler = false;
    }
  }
});
