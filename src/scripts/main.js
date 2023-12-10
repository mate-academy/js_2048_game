'use strict';

const getGameField = document.querySelector('.game-field');
const getButton = document.querySelector('.button');
const getScore = document.querySelector('.game-score');

const getMessageLose = document.querySelector('.message-lose');
const getMessageWin = document.querySelector('.message-win');
const getMessageStart = document.querySelector('.message-start');

const GRID_SIZE = 4;
const INITIAL_SCORE = 0;
const WIN_NUM = 2048;
let score = 0;
let board = [];

// Initialize Game
function initializeGame() {
  resetGameBoard();
  setRandomCell();
  setRandomCell();
  updateScore();
}

function resetGameBoard() {
  board = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  renderCell();
}

function updateScore() {
  getScore.textContent = INITIAL_SCORE;
}

// Set random cells
function isEmptyField() {
  return board.some((row) => row.some((cell) => cell === 0));
}

function setRandomCell() {
  if (!isEmptyField()) {
    return;
  }

  let r, c;

  do {
    r = Math.floor(Math.random() * GRID_SIZE);
    c = Math.floor(Math.random() * GRID_SIZE);
  } while (board[r][c] !== 0);

  board[r][c] = Math.random() < 0.9 ? 2 : 4;
  renderCell();
}

function renderCell() {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = getGameField.rows[r].cells[c];

      cell.className = `field-cell field-cell--${board[r][c]}`;
      cell.textContent = board[r][c] || '';
    }
  }
}

// Start game
getButton.addEventListener('click', () => {
  getButton.classList.toggle('start', false);
  getButton.classList.toggle('restart', true);
  getButton.innerText = 'Restart';

  getMessageWin.classList.add('hidden');
  getMessageLose.classList.add('hidden');
  getMessageStart.classList.add('hidden');

  initializeGame();
});

document.addEventListener('keydown', moveNumbers);

// move numbers and score updating
function moveNumbers(e) {
  if (checkEndGame()) {
    return;
  }

  switch (e.key) {
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
      return;
  }

  checkEndGame();
  checkWinGame();
}

function cloneGameField() {
  return board.map((row) => row.slice());
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].join() !== arr2[i].join()) {
      return false;
    }
  }

  return true;
}

function moveUp() {
  const prevState = cloneGameField();
  const transposedField = transpose(board);

  transposedField.forEach((row, index) => {
    const newRow = row.filter((value) => value !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] += newRow[i];
        score += newRow[i];
        newRow.splice(i + 1, 1);
      }
    }

    transposedField[index] = newRow.concat(
      Array(GRID_SIZE - newRow.length).fill(0),
    );
  });

  board = transpose(transposedField);

  updateGame(prevState);
}

function moveDown() {
  const prevState = cloneGameField();
  const transposedField = transpose(board);

  transposedField.forEach((row, index) => {
    const newRow = row.filter((value) => value !== 0).reverse();

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] += newRow[i];
        score += newRow[i];
        newRow.splice(i + 1, 1);
      }
    }

    transposedField[index] = Array(GRID_SIZE - newRow.length)
      .fill(0)
      .concat(newRow.reverse());
  });

  board = transpose(transposedField);

  updateGame(prevState);
}

function moveLeft() {
  const prevState = cloneGameField();

  board.forEach((row, index) => {
    const newRow = row.filter((value) => value !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] += newRow[i];
        score += newRow[i];
        newRow.splice(i + 1, 1);
      }
    }
    board[index] = newRow.concat(Array(GRID_SIZE - newRow.length).fill(0));
  });

  updateGame(prevState);
}

function moveRight() {
  const prevState = cloneGameField();

  board.forEach((row, index) => {
    const newRow = row.filter((value) => value !== 0).reverse();

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] += newRow[i];
        score += newRow[i];
        newRow.splice(i + 1, 1);
      }
    }

    board[index] = Array(GRID_SIZE - newRow.length)
      .fill(0)
      .concat(newRow.reverse());
  });

  updateGame(prevState);
}

function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]));
}

function updateGame(prevState) {
  const newState = cloneGameField();

  if (!arraysEqual(prevState, newState)) {
    setRandomCell();
  }

  getScore.textContent = score;
  renderCell();
}

// win lose checking
function checkWinGame() {
  const found = board.some((row) => row.includes(WIN_NUM));

  if (found) {
    getMessageWin.classList.remove('hidden');
  }
}

function checkEndGame() {
  if (!isEmptyField()) {
    getMessageLose.classList.remove('hidden');

    return true;
  }
}
