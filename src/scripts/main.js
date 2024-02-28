'use strict';

// UI
const gameScore = document.querySelector('.game-score');
const highScore = document.querySelector('.high-score');

// Button
const startBtn = document.querySelector('.start');
const restartBtn = document.querySelector('.restart');

// Message
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

// Game fields
let isGameHas2048 = false;
let score = 0;
const rows = 4;
const columns = 4;
const cell = [...document.querySelectorAll('.field-cell')];
let board;
const scoreFromLocalStorage = localStorage.getItem('highScore');

// Game logic
window.onload = () => {
  if (scoreFromLocalStorage) {
    highScore.textContent = scoreFromLocalStorage;
  } else {
    highScore.textContent = 0;
  }
};

startBtn.addEventListener('click', () => {
  setGame();

  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  restartBtn.classList.remove('hidden');
  startBtn.classList.add('hidden');
});

restartBtn.addEventListener('click', () => {
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (score > scoreFromLocalStorage) {
    highScore.textContent = score;
    localStorage.setItem('highScore', score);
  }

  score = 0;
  gameScore.textContent = score;
  setGame();
});

const setGame = () => {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const num = board[r][c];
      const cellIndex = r * columns + c;
      const cellElement = cell[cellIndex];

      updateCell(cellElement, num);
    }
  }

  setTwoOrFour();
  setTwoOrFour();
};

const updateCell = (cellElement, num) => {
  cellElement.textContent = '';
  cellElement.classList.value = '';
  cellElement.classList.add('field-cell');

  if (num > 0) {
    cellElement.textContent = num.toString();

    if (num < 2048) {
      cellElement.classList.add(`field-cell--${num.toString()}`);
    }
  }

  if (num === 2048) {
    isGameHas2048 = true;
    winMessage.classList.remove('hidden');
  }
};

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    if (slideLeft()) {
      setTwoOrFour();
    }
  } else if (e.code === 'ArrowRight') {
    if (slideRigth()) {
      setTwoOrFour();
    }
  } else if (e.code === 'ArrowUp') {
    if (slideUp()) {
      setTwoOrFour();
    }
  } else if (e.code === 'ArrowDown') {
    if (slideDown()) {
      setTwoOrFour();
    }
  }
});

const filterZero = (rowArr) => {
  return rowArr.filter(num => num !== 0);
};

const slide = (rowArr) => {
  let newArr = filterZero(rowArr);

  for (let i = 0; i < newArr.length - 1; i++) {
    if (newArr[i] === newArr[i + 1]) {
      newArr[i] *= 2;
      newArr[i + 1] = 0;
      score += newArr[i];
      gameScore.textContent = score;
    }
  }

  newArr = filterZero(newArr);

  while (newArr.length < 4) {
    newArr.push(0);
  }

  return newArr;
};

const slideLeft = () => {
  let isChange = false;

  for (let r = 0; r < rows; r++) {
    const row = board[r];

    const newRow = slide(row);

    if (!isArrayEqual(row, newRow)) {
      isChange = true;
    }
    board[r] = newRow;

    for (let c = 0; c < columns; c++) {
      const num = board[r][c];
      const cellIndex = r * columns + c;
      const cellElement = cell[cellIndex];

      updateCell(cellElement, num);
    }
  }

  return isChange;
};

const slideRigth = () => {
  let isChange = false;

  for (let r = 0; r < rows; r++) {
    const row = board[r];
    const originalArr = [...row];

    const rowReverse = row.reverse();
    const newRow = slide(rowReverse);
    const newRowReverse = newRow.slice().reverse();

    if (!isArrayEqual(originalArr, newRowReverse)) {
      isChange = true;
    }

    board[r] = newRowReverse;

    for (let c = 0; c < columns; c++) {
      const num = board[r][c];
      const cellIndex = r * columns + c;
      const cellElement = cell[cellIndex];

      updateCell(cellElement, num);
    }
  }

  return isChange;
};

const slideUp = () => {
  let isChange = false;

  for (let c = 0; c < columns; c++) {
    const row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    const newRow = slide(row);

    if (!isArrayEqual(row, newRow)) {
      isChange = true;
    }

    for (let r = 0; r < rows; r++) {
      board[r][c] = newRow[r];

      const num = board[r][c];
      const cellIndex = r * columns + c;
      const cellElement = cell[cellIndex];

      updateCell(cellElement, num);
    }
  }

  return isChange;
};

const slideDown = () => {
  let isChange = false;

  for (let c = 0; c < columns; c++) {
    const row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const originalRow = [...row];

    const rowReverse = row.reverse();
    const newRow = slide(rowReverse);
    const newRowReverse = newRow.slice().reverse();

    if (!isArrayEqual(originalRow, newRowReverse)) {
      isChange = true;
    }

    for (let r = 0; r < rows; r++) {
      board[r][c] = newRowReverse[r];

      const num = board[r][c];
      const cellIndex = r * columns + c;
      const cellElement = cell[cellIndex];

      updateCell(cellElement, num);
    }
  }

  return isChange;
};

const isArrayEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
};

const randomTile = () => Math.random() > 0.9 ? 4 : 2;

const isEmptyTile = () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
};

const checkHorizontalGameOver = () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (board[r][c] === board[r][c + 1]) {
        return false;
      }
    }
  }

  return true;
};

const checkVerticalGameOver = () => {
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
};

const isGameOver = () => {
  if (isEmptyTile()) {
    return false;
  }

  return checkHorizontalGameOver() && checkVerticalGameOver();
};

const setTwoOrFour = () => {
  if (!isEmptyTile()) {
    return;
  }

  let found = false;

  while (!found && !isGameHas2048) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = randomTile();

      const cellIndex = r * columns + c;
      const cellElement = cell[cellIndex];

      updateCell(cellElement, board[r][c]);
      found = true;
    }

    if (board[r][c] === 2048) {
      isGameHas2048 = true;
    }

    if (isGameOver()) {
      loseMessage.classList.remove('hidden');

      if (score > highScore.value) {
        highScore.textContent = score;
        localStorage.setItem('highScore', score);
      }
    }
  }
};
