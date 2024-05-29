'use strict';
/* eslint-disable */
const refs = {
  startBtn: document.querySelector('.start'),
  fieldCells: document.querySelectorAll('.field-cell'),
  fieldRows: document.querySelectorAll('.field-row'),
  messageStart: document.querySelector('.message-start'),
  messageLose: document.querySelector('.message-lose'),
  messageWin: document.querySelector('.message-win'),
  score: document.querySelector('.game-score'),
};

const WIN_VALUE = 2048;
const FIELD_SIZE = 16; // Adjusted to the total number of cells
const NEW_CELL_VALUE = 2;
const RARE_NEW_CELL_VALUE = 4;
const RARE_CELL_CHANCE = 10;
const FIELD_LENGTH = 4;

const inputHandler = ({ key }) => {
  moveCells(key);
};

refs.startBtn.addEventListener('click', newGame);

function newGame() {
  resetField();
  addCell(getRandomCell(), getToken());
  addCell(getRandomCell(), getToken());
  window.addEventListener('keydown', inputHandler);
}

function getRandomCell() {
  const emptyCells = [...refs.fieldCells]
    .map((cell, index) => (cell.textContent === '' ? index : -1))
    .filter(index => index !== -1);

  if (emptyCells.length === 0) {
    return -1;
  }

  const randomIndex = getRandomNum(emptyCells.length);
  return emptyCells[randomIndex];
}

function getToken() {
  return getRandomNum(100) <= RARE_CELL_CHANCE
    ? RARE_NEW_CELL_VALUE
    : NEW_CELL_VALUE;
}

function getRandomNum(maxVal) {
  return Math.floor(Math.random() * maxVal);
}

function hasFreeSpace() {
  return [...refs.fieldCells].some((cell) => cell.textContent === '');
}

function resetField() {
  const { messageStart, messageLose, messageWin, score, fieldCells } = refs;

  score.textContent = '0';

  [messageStart, messageLose, messageWin].forEach(({ classList }) =>
    classList.add('hidden')
  );

  fieldCells.forEach((cell) => {
    [...cell.classList].forEach(cls => {
      if (cls.startsWith('field-cell--')) {
        cell.classList.remove(cls);
      }
    });
    cell.textContent = '';
  });
}

function updateStartButton() {
  const { startBtn } = refs;

  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
  startBtn.textContent = 'Restart';
}

function moveCells(keyPressed) {
  updateStartButton();

  const cellsMoved = rearrangeCells(keyPressed);
  if (cellsMoved) {
    addCell(getRandomCell(), getToken());
  }

  if (!hasFreeSpace() && !hasPossibleMoves()) {
    finishGame(refs.messageLose);
  }
}

function addCell(cellPosition, cellValue) {
  if (cellPosition === -1) {
    return;
  }

  const { fieldCells } = refs;
  const cell = fieldCells[cellPosition];

  cell.classList.add(`field-cell--${cellValue}`);
  cell.textContent = cellValue;
}

function finishGame(endGameMessage) {
  endGameMessage.classList.remove('hidden');
  window.removeEventListener('keydown', inputHandler);
}

function updateScore(points) {
  const { score } = refs;
  const currentPoints = +score.textContent;

  score.textContent = currentPoints + points;
}

function rearrangeCells(direction) {
  const { fieldCells, fieldRows } = refs;

  const rows = (direction === 'ArrowLeft' || direction === 'ArrowRight')
    ? [...fieldRows]
    : createFieldColumns(fieldCells);

  const initialRowValues = rows
    .map((row) => [...row.children].map((cel) => cel.textContent))
    .flat();

  rows.forEach((row) => {
    const initialCells = (direction === 'ArrowLeft' || direction === 'ArrowUp')
      ? [...row.children]
      : [...row.children].reverse();

    const filledCellsValues = initialCells
      .filter((cell) => cell.textContent !== '')
      .map(({ textContent }) => parseInt(textContent));

    for (let i = 1; i < filledCellsValues.length; i++) {
      if (filledCellsValues[i] === filledCellsValues[i - 1]) {
        filledCellsValues[i - 1] = filledCellsValues[i - 1] * 2;
        updateScore(filledCellsValues[i - 1]);
        filledCellsValues.splice(i, 1);
        filledCellsValues.push('');
      }
    }

    const updatedCells = (direction === 'ArrowLeft' || direction === 'ArrowUp')
      ? [...filledCellsValues, '', '', '', ''].slice(0, FIELD_LENGTH)
      : [...filledCellsValues, '', '', '', ''].slice(0, FIELD_LENGTH).reverse();

    [...row.children].forEach((cell, i) => {
      const cellValue = updatedCells[i];
      cell.textContent = cellValue ? cellValue.toString() : '';
      [...cell.classList].forEach(cls => {
        if (cls.startsWith('field-cell--')) {
          cell.classList.remove(cls);
        }
      });
      if (cellValue) {
        cell.classList.add(`field-cell--${cellValue}`);
        if (cellValue === WIN_VALUE) {
          finishGame(refs.messageWin);
        }
      }
    });
  });

  const finalRowValues = rows
    .map((row) => [...row.children].map((cel) => cel.textContent))
    .flat();

  return !arraysEqual(initialRowValues, finalRowValues);
}

function hasPossibleMoves() {
  const { fieldRows } = refs;

  for (let rowIndex = 0; rowIndex < fieldRows.length; rowIndex++) {
    for (let cellIndex = 0; cellIndex < fieldRows[rowIndex].children.length; cellIndex++) {
      const cell = fieldRows[rowIndex].children[cellIndex];
      const cellValue = cell.textContent;

      if (
        (fieldRows[rowIndex].children[cellIndex + 1] &&
          cellValue === fieldRows[rowIndex].children[cellIndex + 1].textContent) ||
        (fieldRows[rowIndex + 1] &&
          cellValue === fieldRows[rowIndex + 1].children[cellIndex].textContent)
      ) {
        return true;
      }
    }
  }

  return false;
}

function createFieldColumns(cells) {
  const numCols = cells.length / FIELD_LENGTH;
  const fieldColumns = [];

  for (let row = 0; row < FIELD_LENGTH; row++) {
    const children = [];
    for (let col = 0; col < numCols; col++) {
      const index = col * FIELD_LENGTH + row;
      children.push(cells[index]);
    }
    fieldColumns.push({ children });
  }

  return fieldColumns;
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
