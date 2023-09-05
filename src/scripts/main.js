'use strict';

let matrix = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const message = [
  document.querySelector('.message-start'),
  document.querySelector('.message-win'),
  document.querySelector('.message-lose'),
];
const buttonStart = document.querySelector('.button');
const gameFieldCells = document.querySelectorAll('.field-cell');
const infoScore = document.querySelector('.game-score');
let gameScore = +(infoScore.textContent);
const ROW_LENGTH = 4;
const PROBILITY_NUMBER = 0.1;

const resetGameFieldCells = function() {
  gameFieldCells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'field-cell';
  });
};

function setButtonStatus(condition) {
  buttonStart.textContent = condition;
  buttonStart.classList.toggle('game-start', condition === 'Start');
  buttonStart.classList.toggle('game-restart', condition === 'Restart');
}

addRandomCell();
addRandomCell();

buttonStart.addEventListener('click', () => {
  if (buttonStart.classList.contains('game-start')) {
    goStart();
  } else {
    goEnd();
  }
});

function goStart() {
  setButtonStatus('Restart');
  message[0].classList.add('hidden');
  resetGameFieldCells();
  addRandomCell();
  addRandomCell();
};

function goEnd() {
  setButtonStatus('Start');
  message[0].classList.remove('hidden');
  matrix = matrix.map(row => row.map(() => 0));
  resetGameFieldCells();
  gameScore = 0;
  addRandomCell();
  addRandomCell();
};

function addRandomCell() {
  const emptyCells = [];

  matrix.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      if (cellValue === 0) {
        emptyCells.push({
          row: rowIndex,
          col: colIndex,
        });
      }
    });
  });

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomNumber = Math.random() < PROBILITY_NUMBER ? 4 : 2;
    const randomCell = emptyCells[randomIndex];

    matrix[randomCell.row][randomCell.col] = randomNumber;

    const index = randomCell.row * 4 + randomCell.col;

    gameFieldCells[index].textContent = `${randomNumber}`;
    gameFieldCells[index].classList.add(`field-cell--${randomNumber}`);
  }
}

function matrixEquals(newMatrix, prevMatrix = matrix) {
  for (let row = 0; row < ROW_LENGTH; row++) {
    for (let col = 0; col < ROW_LENGTH; col++) {
      if (newMatrix[row][col] !== prevMatrix[row][col]) {
        matrix = newMatrix;

        return false;
      }
    }
  }

  return true;
}

function upgradeFeilds() {
  resetGameFieldCells();

  matrix.forEach((row, rowIndex) => {
    row.forEach((cellValue, collIndex) => {
      const index = rowIndex * 4 + collIndex;

      if (cellValue !== 0) {
        gameFieldCells[index].textContent = `${cellValue}`;
        gameFieldCells[index].classList.add(`field-cell--${cellValue}`);
      }
    });
  });

  infoScore.textContent = gameScore;
}

document.addEventListener('keydown', click => {
  if (!areMovesAvailable()) {
    message[2].classList.remove('hidden');
    message[0].classList.add('hidden');

    return;
  }

  switch (click.key) {
    case 'ArrowLeft':
      return moveLeft();

    case 'ArrowRight':
      return moveRight();

    case 'ArrowUp':
      return moveUp();

    case 'ArrowDown':
      return moveDown();
  }
});

function areMovesAvailable() {
  for (let row = 0; row < ROW_LENGTH; row++) {
    for (let col = 0; col < ROW_LENGTH; col++) {
      if (matrix[row][col] === 0) {
        return true;
      }
    }
  }

  for (let row = 0; row < ROW_LENGTH; row++) {
    for (let col = 0; col < ROW_LENGTH; col++) {
      const currentValue = matrix[row][col];

      if (col > 0 && matrix[row][col - 1] === currentValue) {
        return true;
      }

      if (col < ROW_LENGTH - 1 && matrix[row][col + 1] === currentValue) {
        return true;
      }

      if (row > 0 && matrix[row - 1][col] === currentValue) {
        return true;
      }

      if (row < ROW_LENGTH - 1 && matrix[row + 1][col] === currentValue) {
        return true;
      }
    }
  }

  return false;
}

function moveLeft() {
  let count = 0;

  const result = matrix.map(row => {
    return row.filter(col => col !== 0);
  });

  result.forEach(row => {
    row.forEach((col, index) => {
      if (row[index] === row[index + 1]) {
        row[index] = row[index] * 2;
        count += row[index];
        row[index + 1] = 0;
      }
    });
  });

  result.forEach(row => {
    while (row.length < ROW_LENGTH) {
      row.push(0);
    }
  });

  if (!matrixEquals(result)) {
    gameScore += count;
    matrix = result;
    upgradeFeilds();
    addRandomCell();
  }
}

function moveRight() {
  let count = 0;

  const result = [];

  matrix.forEach(row => {
    const newRow = [];

    for (let i = ROW_LENGTH - 1; i >= 0; i--) {
      if (row[i] !== 0) {
        newRow.unshift(row[i]);
      }
    }

    while (newRow.length < ROW_LENGTH) {
      newRow.unshift(0);
    }

    result.push(newRow);
  });

  result.forEach((row, rowIndex) => {
    for (let i = ROW_LENGTH - 1; i > 0; i--) {
      if (row[i] === row[i - 1]) {
        row[i] *= 2;
        count += row[i];
        row[i - 1] = 0;
      }
    }
  });

  if (!matrixEquals(result)) {
    gameScore += count;
    matrix = result;
    upgradeFeilds();
    addRandomCell();
  }
}

function moveUp() {
  let count = 0;

  const result = matrix.map(row => [...row]);

  for (let col = 0; col < result[0].length; col++) {
    for (let row = 1; row < result.length; row++) {
      if (result[row][col] !== 0) {
        for (let prevRow = row - 1; prevRow >= 0; prevRow--) {
          if (result[prevRow][col] === 0) {
            result[prevRow][col] = result[prevRow + 1][col];
            result[prevRow + 1][col] = 0;
          } else if (result[prevRow][col] === result[prevRow + 1][col]) {
            result[prevRow][col] *= 2;
            count += result[prevRow][col];
            result[prevRow + 1][col] = 0;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (!matrixEquals(result)) {
    gameScore += count;
    matrix = result;
    upgradeFeilds();
    addRandomCell();
  }
}

function moveDown() {
  let count = 0;

  const result = matrix.map(row => [...row]);

  for (let col = 0; col < result[0].length; col++) {
    for (let row = result.length - 2; row >= 0; row--) {
      if (result[row][col] !== 0) {
        for (let nextRow = row + 1; nextRow < result.length; nextRow++) {
          if (result[nextRow][col] === 0) {
            result[nextRow][col] = result[nextRow - 1][col];
            result[nextRow - 1][col] = 0;
          } else if (result[nextRow][col] === result[nextRow - 1][col]) {
            result[nextRow][col] *= 2;
            count += result[nextRow][col];
            result[nextRow - 1][col] = 0;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (!matrixEquals(result)) {
    gameScore += count;
    matrix = result;
    upgradeFeilds();
    addRandomCell();
  }
}
