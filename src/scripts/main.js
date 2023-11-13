'use strict';

const gridSize = 4;
let gameMatrix = Array.from(
  { length: gridSize }, () => Array(gridSize).fill(0)
);

const button = document.querySelector('.button');
const field = document.querySelector('.game-field');
const cells = field.querySelectorAll('.field-cell');

const gameScore = document.querySelector('.game-score');
let scoreCount = 0;

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

button.addEventListener('click', () => {
  messageStart.classList.add('hidden');

  if (!messageLose.classList.contains('hidden')) {
    messageLose.classList.add('hidden');
  }

  setScore(0, true);

  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }

  gameMatrix = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

  for (let i = 0; i < 2; i++) {
    setRandomMatrixCells();
  }

  displayOnField();
});

function displayOnField() {
  gameMatrix.forEach((MatrixRow, rowIndex) => {
    MatrixRow.forEach((matrixCell, cellIndex) => {
      const gameCell = cells[rowIndex * gridSize + cellIndex];

      if (gameCell.classList.length > 1) {
        const cellClass = gameCell.classList.item(1);

        gameCell.classList.remove(cellClass);
        gameCell.textContent = '';
      }

      if (matrixCell !== 0) {
        gameCell.classList.add(`field-cell--${matrixCell}`);
        gameCell.textContent = `${matrixCell}`;
      }
    });
  });
}

function setRandomMatrixCells() {
  const randomCellNumber = Math.floor(Math.random() * gridSize);
  const randomRowNumber = Math.floor(Math.random() * gridSize);

  if (gameMatrix[randomRowNumber][randomCellNumber] !== 0) {
    setRandomMatrixCells();
  } else {
    const randomNumberForCell = Math.floor(Math.random() * 10) === 0 ? 4 : 2;

    gameMatrix[randomRowNumber][randomCellNumber] = randomNumberForCell;
  }
}

function setScore(sum, reset) {
  if (reset) {
    scoreCount = 0;
  } else {
    scoreCount += sum;
  }

  gameScore.innerHTML = scoreCount;
}

function createPreviousMatrix() {
  const previousMatrix = [];

  gameMatrix.forEach(row => {
    const newRow = [];

    row.forEach(cell => {
      newRow.push(cell);
    });

    previousMatrix.push(newRow);
  });

  return previousMatrix;
}

function isChanged(previousMatrix) {
  return !gameMatrix.every((row, rowIndex) => {
    return row.every((cell, cellIndex) => {
      return previousMatrix[rowIndex][cellIndex] === cell;
    });
  });
}

function congratTheWinner(sum) {
  if (sum === 2048) {
    messageWin.classList.remove('hidden');
  }
}

document.addEventListener('keydown', () => {
  if (button.classList.contains('restart')) {
    switch (event.key) {
      case 'ArrowUp' :
        moveUp();
        break;

      case 'ArrowDown':
        moveDown();
        break;

      case 'ArrowRight':
        moveRight();
        break;

      case 'ArrowLeft':
        moveLeft();
    }
  }
});

function moveUp() {
  const previousMatrix = createPreviousMatrix();

  for (let rowIndex = 1; rowIndex < gameMatrix.length; rowIndex++) {
    const matrixRow = gameMatrix[rowIndex];

    matrixRow.forEach((matrixCell, cellIndex) => {
      if (matrixCell !== 0) {
        let rowOfAvailableCell = null;

        for (let i = rowIndex - 1; i >= 0; i--) {
          if (
            gameMatrix[i][cellIndex] === 0
              || gameMatrix[i][cellIndex] === matrixCell
          ) {
            rowOfAvailableCell = i;
          } else {
            break;
          }
        }

        if (rowOfAvailableCell !== null) {
          const cellsSum = (
            gameMatrix[rowOfAvailableCell][cellIndex] + matrixCell
          );

          if (gameMatrix[rowOfAvailableCell][cellIndex] !== 0) {
            setScore(cellsSum);
          }

          gameMatrix[rowOfAvailableCell][cellIndex] = cellsSum;
          matrixRow[cellIndex] = 0;

          congratTheWinner(cellsSum);
        }
      }
    });
  }

  if (
    gameMatrix.some((row) => row.includes(0)) && isChanged(previousMatrix)
  ) {
    setRandomMatrixCells();
  }

  displayOnField();
  isGameOver();
}

function moveDown() {
  const previousMatrix = createPreviousMatrix();

  for (let rowIndex = gameMatrix.length - 2; rowIndex >= 0; rowIndex--) {
    const matrixRow = gameMatrix[rowIndex];

    matrixRow.forEach((matrixCell, cellIndex) => {
      if (matrixCell !== 0) {
        let rowOfAvailableCell = null;

        for (let i = rowIndex + 1; i <= gameMatrix.length - 1; i++) {
          if (
            gameMatrix[i][cellIndex] === 0
              || gameMatrix[i][cellIndex] === matrixCell
          ) {
            rowOfAvailableCell = i;
          } else {
            break;
          }
        }

        if (rowOfAvailableCell !== null) {
          const cellsSum = (
            gameMatrix[rowOfAvailableCell][cellIndex] + matrixCell
          );

          if (gameMatrix[rowOfAvailableCell][cellIndex] !== 0) {
            setScore(cellsSum);
          }

          gameMatrix[rowOfAvailableCell][cellIndex] = cellsSum;

          gameMatrix[rowIndex][cellIndex] = 0;

          congratTheWinner(cellsSum);
        }
      }
    });
  }

  if (
    gameMatrix.some((row) => row.includes(0)) && isChanged(previousMatrix)
  ) {
    setRandomMatrixCells();
  }

  displayOnField();
  isGameOver();
}

function moveRight() {
  const previousMatrix = createPreviousMatrix();

  for (let rowIndex = 0; rowIndex < gameMatrix.length; rowIndex++) {
    const matrixRow = gameMatrix[rowIndex];

    for (let cellIndex = matrixRow.length - 2; cellIndex >= 0; cellIndex--) {
      const matrixCell = matrixRow[cellIndex];

      if (matrixCell !== 0) {
        let indexOfAvailableCell = null;

        for (let i = cellIndex + 1; i <= matrixRow.length; i++) {
          if (
            matrixRow[i] === 0
              || matrixRow[i] === matrixCell
          ) {
            indexOfAvailableCell = i;
          } else {
            break;
          }
        }

        if (indexOfAvailableCell !== null) {
          const cellsSum = (
            gameMatrix[rowIndex][indexOfAvailableCell]
            + matrixCell
          );

          if (gameMatrix[rowIndex][indexOfAvailableCell] !== 0) {
            setScore(cellsSum);
          }

          gameMatrix[rowIndex][indexOfAvailableCell] = cellsSum;

          matrixRow[cellIndex] = 0;

          congratTheWinner(cellsSum);
        }
      }
    }
  }

  if (
    gameMatrix.some((row) => row.includes(0)) && isChanged(previousMatrix)
  ) {
    setRandomMatrixCells();
  }

  displayOnField();
  isGameOver();
}

function moveLeft() {
  const previousMatrix = createPreviousMatrix();

  for (let rowIndex = 0; rowIndex < gameMatrix.length; rowIndex++) {
    const matrixRow = gameMatrix[rowIndex];

    matrixRow.forEach((matrixCell, cellIndex) => {
      if (matrixCell !== 0) {
        let indexOfAvailableCell = null;

        for (let i = cellIndex - 1; i >= 0; i--) {
          if (
            matrixRow[i] === 0
              || matrixRow[i] === matrixCell
          ) {
            indexOfAvailableCell = i;
          } else {
            break;
          }
        }

        if (indexOfAvailableCell !== null) {
          const cellsSum = matrixRow[indexOfAvailableCell] + matrixCell;

          if (matrixRow[indexOfAvailableCell] !== 0) {
            setScore(cellsSum);
          }

          matrixRow[indexOfAvailableCell] = cellsSum;
          matrixRow[cellIndex] = 0;

          congratTheWinner(cellsSum);
        }
      }
    });
  }

  if (gameMatrix.some((row) => row.includes(0)) && isChanged(previousMatrix)) {
    setRandomMatrixCells();
  }

  displayOnField();
  isGameOver();
}

function isGameOver() {
  if (!hasEmptyCell() && !canMerge()) {
    messageLose.classList.remove('hidden');
  }
}

function hasEmptyCell() {
  return gameMatrix.some(matrixRow => matrixRow.includes(0));
}

function canMerge() {
  for (let rowIndex = 0; rowIndex < gameMatrix.length; rowIndex++) {
    for (let cellIndex = 0; cellIndex < gameMatrix.length; cellIndex++) {
      if (rowIndex === gameMatrix.length - 1) {
        if (gameMatrix[rowIndex][cellIndex]
            === gameMatrix[rowIndex][cellIndex + 1]) {
          return true;
        }
      } else if (gameMatrix[rowIndex][cellIndex]
          === gameMatrix[rowIndex + 1][cellIndex]
          || gameMatrix[rowIndex][cellIndex]
            === gameMatrix[rowIndex][cellIndex + 1]) {
        return true;
      }
    }
  }
}
