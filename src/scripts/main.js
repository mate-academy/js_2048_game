'use strict';

const startButton = document.querySelector('.start');
const gameField = document.querySelector('.game-field');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');

let score = 0;

const numRows = 4;
const numCols = 4;
const matrix = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],

];

function updateBoard() {
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const number = matrix[i][j];
      const cell = gameField.rows[i].cells[j];

      cell.textContent = '';
      cell.classList.value = '';
      cell.classList.add('field-cell');

      if (number > 0) {
        cell.textContent = number;
        cell.classList.add(`field-cell--${number}`);
      }
    }
  }
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    // Якщо кнопка має клас "restart", очистити всі клітинки
    startButton.classList.remove('restart');
    startButton.textContent = 'Start';
    score = 0;
    gameScore.textContent = score;

    matrix.forEach(cell => {
      cell.splice(0, numRows, 0, 0, 0, 0);
    });

    generateRandomCells();
    generateRandomCells();
  } else {
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    score = 0;
    gameScore.textContent = score;

    matrix.forEach(cell => {
      cell.splice(0, numRows, 0, 0, 0, 0);
      messageLose.classList.add('hidden');
    });
    generateRandomCells();
    generateRandomCells();
  }
});

function generateRandomCells() {
  if (!hasEmptyCell()) {
    return;
  }

  const r = Math.floor(Math.random() * numRows);
  const c = Math.floor(Math.random() * numCols);

  if (matrix[r][c] === 0) {
    matrix[r][c] = (Math.random() >= 0.9) ? 4 : 2;
    updateBoard();
  } else {
    generateRandomCells();
  }
}

function hasEmptyCell() {
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (matrix[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function canMerge() {
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (r > 0 && matrix[r][c] === matrix[r - 1][c]) {
        return true;
      }

      if (r < numRows - 1 && matrix[r][c] === matrix[r + 1][c]) {
        return true;
      }

      if (c > 0 && matrix[r][c] === matrix[r][c - 1]) {
        return true;
      }

      if (c < numCols - 1 && matrix[r][c] === matrix[r][c + 1]) {
        return true;
      } else if (matrix[r][c] === 2048) {
        return messageWin.classList.remove('hidden');
      }
    }
  }

  return false;
}

document.addEventListener('keydown', (movement) => {
  const key = movement.key;

  if (!hasEmptyCell() && !canMerge()) {
    return messageLose.classList.remove('hidden');
  }

  switch (key) {
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    default:
  }

  gameScore.textContent = score;
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
  generateRandomCells();
});

function moveUp() {
  for (let j = 0; j < numCols; j++) {
    const col = [];

    for (let i = 0; i < numRows; i++) {
      col.push(matrix[i][j]);
    }

    const filteredCol = move(col);

    for (let k = 0; k < numRows; k++) {
      matrix[k][j] = filteredCol[k];
    }
    updateBoard();
  }
}

function moveDown() {
  for (let j = 0; j < numCols; j++) {
    const col = [];

    for (let i = numRows - 1; i >= 0; i--) {
      col.push(matrix[i][j]);
    }

    const filteredCol = move(col);

    for (let i = numRows - 1; i >= 0; i--) {
      matrix[i][j] = filteredCol[numRows - 1 - i];
    }
  }

  updateBoard();
}

function moveLeft() {
  for (let i = 0; i < numRows; i++) {
    const leftShift = matrix[i];

    const filteredRow = move(leftShift);

    matrix[i] = filteredRow;

    updateBoard();
  }
}

function moveRight() {
  for (let i = 0; i < numRows; i++) {
    const rightShift = [...matrix[i]].reverse();

    const filteredRow = move(rightShift);

    matrix[i] = filteredRow.reverse();

    updateBoard();
  }
}

function move(row) {
  let filteredRow = row.filter(number => number !== 0);

  for (let j = 0; j < filteredRow.length - 1; j++) {
    if (filteredRow[j] === filteredRow[j + 1]) {
      filteredRow[j] *= 2;
      filteredRow[j + 1] = 0;
      score += filteredRow[j];
    }
  }

  filteredRow = filteredRow.filter(number => number !== 0);

  while (filteredRow.length < numCols) {
    filteredRow.push(0);
  }

  return filteredRow;
}
