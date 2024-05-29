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
const FIELD_LENGTH = 15;
const NEW_CELL_VALUE = 2;
const RARE_NEW_CELL_VALUE = 4;
const RARE_CELL_CHANCE = 10;

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
  if (!hasFreeSpace()) {
    return -1;
  }

  let randomCell = getRandomNum(FIELD_LENGTH);

  while (refs.fieldCells[randomCell].textContent !== '') {
    randomCell = getRandomNum(FIELD_LENGTH);
  }

  return randomCell;
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
    classList.add('hidden'),
);

  fieldCells.forEach((cell) => {
    cell.classList.remove(cell.classList[1]);
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

  !rearrangeCells(keyPressed) && addCell(getRandomCell(), getToken());

  !hasFreeSpace() && !hasPossibleMoves() && finishGame(refs.messageLose);
}

function addCell(cellPosition, cellValue) {
  if (cellPosition === -1) {
    return;
  }

  const { fieldCells } = refs;

  fieldCells[cellPosition].classList.add(`field-cell--${cellValue}`);
  fieldCells[cellPosition].textContent = cellValue;
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

  const rows =
    direction === 'ArrowLeft' || direction === 'ArrowRight'
      ? [...fieldRows]
      : createFieldColumns(fieldCells);

  const initialRowValues = rows
    .map((row) => [...row.children].map((cel) => cel.textContent))
    .flat();

  rows.forEach((row) => {
    const initialCells =
      direction === 'ArrowLeft' || direction === 'ArrowUp'
        ? [...row.children]
        : [...row.children].reverse();

    const filledCellsValues = initialCells
      .filter((cell) => cell.textContent !== '')
      .map(({ textContent }) => textContent);

    filledCellsValues.forEach((cell, i) => {
      if (
        filledCellsValues[i - 1] !== undefined &&
        filledCellsValues[i - 1] === filledCellsValues[i]
      ) {
        updateScore(+filledCellsValues[i] + +filledCellsValues[i - 1]);

        filledCellsValues[i - 1] =
          +filledCellsValues[i] + +filledCellsValues[i - 1];

        filledCellsValues.splice(i, 1);
      }
    });

    const updatedCells =
      direction === 'ArrowLeft' || direction === 'ArrowUp'
        ? [...filledCellsValues, '', '', '', ''].slice(0, 4)
        : [...filledCellsValues, '', '', '', ''].slice(0, 4).reverse();

    [...row.children].forEach((cell, i2) => {
      const cellValue = updatedCells[i2];

      cell.textContent = cellValue;
      cell.classList[1] && cell.classList.remove(cell.classList[1]);
      +cellValue === WIN_VALUE && finishGame(refs.messageWin);
      cellValue && cell.classList.add(`field-cell--${cellValue}`);
    });
  });

  const finalRowValues = rows
    .map((row) => [...row.children].map((cel) => cel.textContent))
    .flat();

  return JSON.stringify(initialRowValues) === JSON.stringify(finalRowValues);
}

function hasPossibleMoves() {
  const { fieldRows } = refs;

  for (let i = 0; i < fieldRows.length; i++) {
    for (let i2 = 0; i2 < fieldRows[i].children.length; i2++) {
      const cell = fieldRows[i].children[i2];

      if (
        (fieldRows[i].children[i2 + 1] &&
          cell.textContent === fieldRows[i].children[i2 + 1].textContent) ||
        (fieldRows[i + 1] &&
          cell.textContent === fieldRows[i + 1].children[i2].textContent)
      ) {
        return true;
      }
    }
  }

  return false;
}

function createFieldColumns(cells) {
  const rowsCount = 4;
  const numCols = cells.length / rowsCount;

  const fieldColumns = [];

  for (let row = 0; row < rowsCount; row++) {
    const children = [];

    for (let col = 0; col < numCols; col++) {
      const index = col * rowsCount + row;

      children.push(cells[index]);
    }

    fieldColumns.push({ children });
  }

  return fieldColumns;
}
