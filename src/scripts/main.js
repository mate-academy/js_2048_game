/* eslint-disable max-len */
'use strict';

const messageLose = document.querySelector('p.message-lose');
const messageWin = document.querySelector('p.message-win');
const messageStart = document.querySelector('p.message-start');
const buttonStart = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const fieldRows = gameField.querySelectorAll('.field-row');
const fieldCells = gameField.querySelectorAll('.field-cell');
let score = 0;

const random = (max) => {
  const num = Math.floor(Math.random() * max);

  return num;
};

const findEmptyCells = () => {
  return Array.from(fieldCells).filter((cell) => !cell.textContent);
};

const addCellNumber = () => {
  const index = random(16);
  const newNumber = random(10) < 9 ? '2' : '4';

  if (findEmptyCells().length === 0 || !buttonStart.hasAttribute('start')) {
    return;
  }

  if (!fieldCells[index].textContent) {
    fieldCells[index].textContent = newNumber;
  } else {
    addCellNumber();
  }

  checkWin();
  checkLoose();
};

const checkWin = () => {
  if (Array.from(fieldCells).some((cell) => cell.textContent === '2048')) {
    messageWin.classList.remove('hidden');
  }
};

const checkLoose = () => {
  if (findEmptyCells().length > 0) {
    return;
  }

  for (let i = 0; i < fieldRows.length; i++) {
    const rowCells = Array.from(fieldRows[i].children);

    for (let k = 0; k < rowCells.length - 1; k++) {
      if (rowCells[k].textContent === rowCells[k + 1].textContent) {
        return;
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    const colCells = [
      fieldRows[0].children[i],
      fieldRows[1].children[i],
      fieldRows[2].children[i],
      fieldRows[3].children[i],
    ];

    for (let k = 0; k < colCells.length - 1; k++) {
      if (colCells[k].textContent === colCells[k + 1].textContent) {
        return;
      }
    }
  }

  messageLose.classList.remove('hidden');
};

const pressStart = () => {
  fieldCells.forEach((cell) => {
    cell.textContent = '';
  });
  score = 0;
  gameScore.textContent = score;
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');
  buttonStart.classList.add('restart');
  buttonStart.textContent = 'Restart';
  buttonStart.setAttribute('start', 'true');
  addCellNumber();
  addCellNumber();
  addClass();
};

const addClass = () => {
  fieldCells.forEach((cell) => {
    cell.classList.forEach((className) => {
      if (className.startsWith('field-cell--')) {
        cell.classList.remove(className);
      }
    });

    if (cell.textContent) {
      cell.classList.add('cell-transition');
    } else {
      cell.classList.remove('cell-transition');
    }

    switch (cell.textContent) {
      case '2':
        cell.classList.add('field-cell--2');
        break;
      case '4':
        cell.classList.add('field-cell--4');
        break;
      case '8':
        cell.classList.add('field-cell--8');
        break;
      case '16':
        cell.classList.add('field-cell--16');
        break;
      case '32':
        cell.classList.add('field-cell--32');
        break;
      case '64':
        cell.classList.add('field-cell--64');
        break;
      case '128':
        cell.classList.add('field-cell--128');
        break;
      case '256':
        cell.classList.add('field-cell--256');
        break;
      case '512':
        cell.classList.add('field-cell--512');
        break;
      case '1024':
        cell.classList.add('field-cell--1024');
        break;
      case '2048':
        cell.classList.add('field-cell--2048');
        break;
      default:
        break;
    }
  });
};

const countScore = (value) => {
  score += value;
  gameScore.textContent = score;
};

const renderAxisX = (values, row, method) => {
  const newValues = values.filter((value) => value !== 0);

  while (newValues.length < 4) {
    newValues[method](0);
  }

  for (let i = 0; i < row.children.length; i++) {
    row.children[i].textContent = newValues[i] === 0 ? '' : newValues[i];
  }
};

const renderAxisY = (values, col, method) => {
  const newValues = values.filter((value) => value !== 0);

  while (newValues.length < 4) {
    newValues[method](0);
  }

  for (let i = 0; i < col.length; i++) {
    col[i].textContent = newValues[i] === 0 ? '' : newValues[i];
  }
};

const moveRight = (row) => {
  const values = Array.from(row.children).map((cell) => +cell.textContent || 0);

  for (let i = values.length - 1; i > 0; i--) {
    if (
      values[i] === (values[i - 1] || values[i - 2] || values[i - 3]) &&
      values[i] !== 0
    ) {
      countScore(values[i]);
      values[i] *= 2;
      values[i - 1] = 0;
    }
  }

  renderAxisX(values, row, 'unshift');
};

const moveLeft = (row) => {
  const values = Array.from(row.children).map((cell) => +cell.textContent || 0);

  for (let i = 0; i < values.length - 1; i++) {
    if (
      values[i] === (values[i + 1] || values[i + 2] || values[i + 3]) &&
      values[i] !== 0
    ) {
      countScore(values[i]);
      values[i] *= 2;
      values[i + 1] = 0;
    }
  }

  renderAxisX(values, row, 'push');
};

const moveUp = () => {
  const columns = [[], [], [], []];

  for (let i = 0; i < fieldCells.length; i++) {
    columns[i % 4].push(fieldCells[i]);
  }

  columns.forEach((col) => {
    const values = col.map((cell) => +cell.textContent || 0);

    for (let i = 0; i < values.length - 1; i++) {
      if (
        values[i] === (values[i + 1] || values[i + 2] || values[i + 3]) &&
        values[i] !== 0
      ) {
        countScore(values[i]);
        values[i] *= 2;
        values[i + 1] = 0;
      }
    }

    renderAxisY(values, col, 'push');
  });
};

const moveDown = () => {
  const columns = [[], [], [], []];

  for (let i = 0; i < fieldCells.length; i++) {
    columns[i % 4].push(fieldCells[i]);
  }

  columns.forEach((col) => {
    const values = col.map((cell) => +cell.textContent || 0);

    for (let i = values.length - 1; i > 0; i--) {
      if (
        values[i] === (values[i - 1] || values[i - 2] || values[i - 3]) &&
        values[i] !== 0
      ) {
        countScore(values[i]);
        values[i] *= 2;
        values[i - 1] = 0;
      }
    }

    renderAxisY(values, col, 'unshift');
  });
};

const moveFn = (e) => {
  switch (e) {
    case 'ArrowRight':
      addCellNumber();
      fieldRows.forEach((row) => moveRight(row));
      addClass();
      break;

    case 'ArrowUp':
      addCellNumber();
      moveUp();
      addClass();
      break;

    case 'ArrowDown':
      addCellNumber();
      moveDown();
      addClass();
      break;

    case 'ArrowLeft':
      addCellNumber();
      fieldRows.forEach((row) => moveLeft(row));
      addClass();
      break;

    default:
  }
};

document.addEventListener('keydown', (e) => moveFn(e.key));

buttonStart.addEventListener('click', pressStart);
