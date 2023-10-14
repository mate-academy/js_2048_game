import { Tile } from './tile.js';

const cellsMatrix = fillCellsMatrixWithCells();
let valuesMatrix = fillValuesMatrix();

const button = document.querySelector('.button');
// const score = document.querySelector('.game-score');
// const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const gameField = document.querySelector('.game-field');

function keydownFunction(e) {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    if (button.classList.contains('start')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';

      messageStart.classList.add('hidden');
    }
  }

  let isCellMoved = false;

  switch (e.key) {
    case 'ArrowLeft':

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (j !== 0) {
            if (valuesMatrix[i][j - 1] === 0 && valuesMatrix[i][j] !== 0) {
              valuesMatrix[i][j - 1] = valuesMatrix[i][j];
              valuesMatrix[i][j] = 0;

              swapCellValues(cellsMatrix[i][j], cellsMatrix[i][j - 1]);
              isCellMoved = true;
              j = 0;
            }
          }
        }
      }

      if (isCellMoved) {
        pushNewCell();
      }

      break;
    case 'ArrowRight':
      break;
    case 'ArrowUp':
      break;
    case 'ArrowDown':
      break;
  }
}

function buttonClickFunction() {
  if (button.classList.contains('restart')) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    messageLose.classList.add('hidden');

    messageStart.classList.remove('hidden');
  }
  clearField();
  valuesMatrix = fillValuesMatrix();

  let coordinates = getRandomPosition();

  const firstValue = getCellValue();
  const secondValue = getCellValue();

  const firstIndexY = coordinates[0];
  const firstIndexX = coordinates[1];
  let secondIndexX;
  let secondIndexY;

  do {
    coordinates = getRandomPosition();

    secondIndexY = coordinates[0];
    secondIndexX = coordinates[1];
  } while (firstIndexX === secondIndexX && firstIndexY === secondIndexY);

  cellsMatrix[firstIndexY][firstIndexX].classList
    .add(`field-cell--${+firstValue}`);
  cellsMatrix[firstIndexY][firstIndexX].textContent = firstValue;
  valuesMatrix[firstIndexY][firstIndexX] = +firstValue;

  cellsMatrix[secondIndexY][secondIndexX].classList
    .add(`field-cell--${+secondValue}`);
  cellsMatrix[secondIndexY][secondIndexX].textContent = secondValue;
  valuesMatrix[secondIndexY][secondIndexX] = +secondValue;
}

function clearField() {
  cellsMatrix.forEach((row) => {
    row.forEach((cell) => {
      cell.removeAttribute('class');
      cell.setAttribute('class', 'field-cell');
      cell.textContent = '';
    });
  });
}

function getRandomPosition() {
  return [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
}

function getCellValue() {
  return Math.floor(Math.random() * 10) === 0 ? '4' : '2';
}

function fillCellsMatrixWithCells() {
  const cellsList = document.querySelectorAll('.field-cell');

  const cellsInARow = 4;
  const cellsCount = cellsList.length;
  const cellsMatrixToReturn = [];

  for (let i = 0; i < cellsCount; i += cellsInARow) {
    cellsMatrixToReturn[i / cellsInARow] = [cellsList[i], cellsList[i + 1],
      cellsList[i + 2], cellsList[i + 3]];
  }

  return cellsMatrixToReturn;
}

function fillValuesMatrix() {
  const matrix = [[], [], [], []];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      matrix[i][j] = 0;
    }
  }

  return matrix;
}

function swapCellValues(from, to) {
  const valueToSwap = from.textContent;
  const classToSwap = `field-cell--${valueToSwap}`;

  from.classList.remove(classToSwap);
  from.textContent = '';

  to.classList.add(classToSwap);
  to.textContent = valueToSwap;
}

function pushNewCell() {
  const val = getCellValue();
  let coordinates;

  if (!checkEmptyFields()) {
    messageLose.classList.remove('hidden');

    return null;
  }

  do {
    coordinates = getRandomPosition();
  } while (valuesMatrix[coordinates[0]][coordinates[1]] !== 0);

  const posY = coordinates[0];
  const posX = coordinates[1];

  valuesMatrix[posY][posX] = val;

  cellsMatrix[posY][posX].classList.add(`field-cell--${val}`);
  cellsMatrix[posY][posX].textContent = val;
}

function checkEmptyFields() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (valuesMatrix[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
}

window.onload = () => {
  buttonClickFunction();
};

window.addEventListener('keydown', keydownFunction);
button.addEventListener('click', buttonClickFunction);
