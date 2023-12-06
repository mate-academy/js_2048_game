'use strict';

/* #region Variables */

let gameMatrix;
let isMovePossible;
let score = 0;
const MATRIX_COLUMNS = 4;
const MATRIX_ROWS = 4;
const FIELD_ROWS = document.querySelectorAll('.field-row');
const FIELD_CELLS = Array.from(FIELD_ROWS)
  .map(row => row.querySelectorAll('.field-cell'));
const MESSAGES = document.querySelectorAll('.message');
const MESSAGE_START = document.querySelector('.message-start');
const MESSAGE_LOSE = document.querySelector('.message-lose');
const MESSAGE_WIN = document.querySelector('.message-win');
const START_BUTTON = document.querySelector('.button');
const SCORE_NUMBER = document.querySelector('.game-score');
/* #endregion */

/* #region Events */
START_BUTTON.addEventListener('click', startGame);

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight') {
    makeMove(slideRight);
  }

  if (e.key === 'ArrowLeft') {
    makeMove(slideLeft);
  }

  if (e.key === 'ArrowDown') {
    makeMove(slideDown);
  }

  if (e.key === 'ArrowUp') {
    makeMove(slideUp);
  }
});

/* #endregion */

/* #region Main functions */
function startGame() {
  gameMatrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  isMovePossible = true;
  updateField();
  SCORE_NUMBER.innerText = `0`;
  START_BUTTON.classList.add('restart');
  START_BUTTON.innerText = 'Restart';
  MESSAGE_START.classList.add('hidden');

  // TODO: hide all messages
  addNewNumber();
  addNewNumber();
  updateField();
}

function updateField() {
  for (let row = 0; row < gameMatrix.length; row++) {
    for (let col = 0; col < gameMatrix[row].length; col++) {
      const num = gameMatrix[row][col];

      FIELD_CELLS[row][col].innerText = num === 0 ? '' : `${num}`;
      FIELD_CELLS[row][col].className = 'field-cell';
      // rewriting all classes each time
      // ? refactor

      if (num !== 0) {
        FIELD_CELLS[row][col].classList.add(`field-cell--${num}`);
      }
    }
  }
}

function addNewNumber() {
  const newRandomNum = getRandomIncluding(1, 10) === 10 ? 4 : 2;
  const emptyCells = [];

  for (let r = 0; r < gameMatrix.length; r++) {
    for (let c = 0; c < gameMatrix[r].length; c++) {
      if (gameMatrix[r][c] === 0) {
        emptyCells.push({
          row: r,
          col: c,
        });
      }
    }
  }

  const randomEmptyCell
  = emptyCells[getRandomIncluding(0, emptyCells.length - 1)];

  gameMatrix[randomEmptyCell.row][randomEmptyCell.col] = newRandomNum;

  isGameOver(gameMatrix);
}

function makeMove(directionFunction) {
  directionFunction(gameMatrix);
  addNewNumber();
  updateField();
  // 3 check if further move is possible
  // 4 if no - game over message

  SCORE_NUMBER.innerText = `${score}`;
}
/* #endregion */

/* #region Move functions */
function slideRight(matrix) {
  for (let r = 0; r < matrix.length; r++) {
    const rowWithoutZero = removeZeroes(matrix[r]);

    if (rowWithoutZero.length > 0) {
      for (let c = rowWithoutZero.length; c >= 0; c--) {
        const currentElement = rowWithoutZero[c];
        const nextElement = rowWithoutZero[c - 1];

        if (currentElement === nextElement) {
          rowWithoutZero[c] = currentElement + nextElement;
          rowWithoutZero[c - 1] = 0;
          score += currentElement;
        }
      }

      const rowWithoutZeroAfterMove = removeZeroes(rowWithoutZero);
      const zeroesToAdd = matrix[r].length
      - rowWithoutZeroAfterMove.length;
      const resultRow = Array(zeroesToAdd)
        .fill(0)
        .concat(rowWithoutZeroAfterMove);

      matrix[r] = resultRow;
    }
  }

  return matrix;
}

function slideLeft(matrix) {
  for (let r = 0; r < matrix.length; r++) {
    const rowWithoutZero = removeZeroes(matrix[r]);

    if (rowWithoutZero.length > 0) {
      for (let c = 0; c < rowWithoutZero.length; c++) {
        const currentElement = rowWithoutZero[c];
        const nextElement = rowWithoutZero[c + 1];

        if (currentElement === nextElement) {
          rowWithoutZero[c] = currentElement + nextElement;
          rowWithoutZero[c + 1] = 0;
          score += currentElement;
        }
      }

      const rowWithoutZeroAfterMove = removeZeroes(rowWithoutZero);
      const zeroesToAdd = matrix[r].length
      - rowWithoutZeroAfterMove.length;
      const resultRow = rowWithoutZeroAfterMove
        .concat(Array(zeroesToAdd).fill(0));

      matrix[r] = resultRow;
    }
  }

  return matrix;
}

function slideDown(matrix) {
  const matrixRotated = rotateMatrix(matrix);
  const matrixRotatedSlidedLeft = slideLeft(matrixRotated);
  const matrixRotatedBack = rotateMatrixBack(matrixRotatedSlidedLeft);

  gameMatrix = matrixRotatedBack;

  return matrixRotatedBack;
}

function slideUp(matrix) {
  const matrixRotated = rotateMatrix(matrix);
  const matrixRotatedSlidedRight = slideRight(matrixRotated);
  const matrixRotatedBack = rotateMatrixBack(matrixRotatedSlidedRight);

  gameMatrix = matrixRotatedBack;

  return matrixRotatedBack;
}
/* #endregion */

/* #region Additional Functions */
function getRandomIncluding(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function isGameOver(rowsOfCells) {
  const hasEmptyCells = rowsOfCells
    .some(row => row
      .some(cell => cell === 0));

  if (hasEmptyCells) {
    return false;
  }

  if (!isMovePossible) {
    MESSAGE_LOSE.classList.remove('hidden');
  }
  // add checking possible moves
  // rerurn true if possible
}

function removeZeroes(row) {
  return row.filter(cell => cell !== 0);
}

function rotateMatrix(matrix) {
  const matrixRotated = [...Array(MATRIX_COLUMNS)]
    .map(() => Array(MATRIX_ROWS));

  for (let row = 0; row < MATRIX_ROWS; row++) {
    for (let cell = 0; cell < MATRIX_COLUMNS; cell++) {
      const currentElement = matrix[row][cell];

      matrixRotated[cell][MATRIX_ROWS - 1 - row] = currentElement;
    }
  }

  return matrixRotated;
}

function rotateMatrixBack(matrix) {
  const matrixRotated = [...Array(MATRIX_COLUMNS)]
    .map(() => Array(MATRIX_ROWS));

  for (let row = 0; row < MATRIX_ROWS; row++) {
    for (let cell = 0; cell < MATRIX_COLUMNS; cell++) {
      const currentElement = matrix[row][cell];

      matrixRotated[MATRIX_COLUMNS - 1 - cell][row] = currentElement;
    }
  }

  return matrixRotated;
}
/* #endregion */

// Step4: add messages to functions
// ===================================
// number = 2048 - winner message
//
// Add animations to CSS
//
