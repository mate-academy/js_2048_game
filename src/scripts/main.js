'use strict';

// write your code here
const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message.message-start');
const messageLose = document.querySelector('.message.message-lose');
const messageWin = document.querySelector('.message.message-win');

const BOARD_SIZE = 4;
const gameOver = false;
let score = 0;
let gameBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function clearBoard() {
  gameBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  cells.forEach(cell => {
    cell.innerText = '';
  });
}

function addRandomTile() {
  const emptyCells = Array.from(cells).filter(cell => cell.innerText === '');

  if (emptyCells.length > 0 && canMove()) {
    const randomCell
    = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const rowIndex = randomCell.parentElement.rowIndex;
    const columnIndex = randomCell.cellIndex;

    gameBoard[rowIndex][columnIndex] = Math.random() < 0.9 ? 2 : 4;
    randomCell.innerText = gameBoard[rowIndex][columnIndex].toString();
  }
}

function updateBoard() {
  gameBoard.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const index = rowIndex * 4 + columnIndex;
      const cell = cells[index];

      cell.innerText = value === 0 ? '' : value;

      cell.className = value === 0
        ? 'field-cell'
        : `field-cell field-cell--${value}`;
    });
  });

  scoreElement.innerText = score;
}

function startGame() {
  clearBoard();
  addRandomTile();
  addRandomTile();
  score = 0;
  updateBoard();
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.innerText = 'Restart';
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
}

function checkLose() {
  if (!canMove() && !canMerged()) {
    messageLose.classList.remove('hidden');
  }
}

function checkWin() {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (gameBoard[row][col] === 2048) {
        messageWin.classList.remove('hidden');

        return true;
      }
    }
  }

  return false;
}

function handleKeyPress(evt) {
  evt.preventDefault();

  if (!gameOver) {
    switch (evt.key) {
      case 'ArrowUp':
        moveTilesUp();
        break;

      case 'ArrowDown':
        moveTilesDown();
        break;

      case 'ArrowLeft':
        moveTilesLeft();
        break;

      case 'ArrowRight':
        moveTilesRight();
        break;

      default:
        break;
    }

    updateBoard();

    checkWin();
    checkLose();
  }
}

function moveTilesUp() {
  for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex++) {
    let column = [];

    for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex++) {
      column.push(gameBoard[rowIndex][colIndex]);
    }

    column = slideTiles(column);

    for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex++) {
      gameBoard[rowIndex][colIndex] = column[rowIndex];
    }
  }

  addRandomTile();
}

function moveTilesDown() {
  for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex++) {
    let column = [];

    for (let rowIndex = 3; rowIndex >= 0; rowIndex--) {
      column.push(gameBoard[rowIndex][colIndex]);
    }

    column = slideTiles(column);

    for (let rowIndex = 3; rowIndex >= 0; rowIndex--) {
      gameBoard[rowIndex][colIndex] = column.shift();
    }
  }

  addRandomTile();
}

function moveTilesLeft() {
  gameBoard.forEach((row, rowIndex) => {
    const slidRow = slideTiles(row);

    gameBoard[rowIndex] = slidRow;
  });

  addRandomTile();
}

function moveTilesRight() {
  gameBoard.forEach((row, rowIndex) => {
    const reversedRow = row.slice().reverse();
    const slidReversedRow = slideTiles(reversedRow);

    gameBoard[rowIndex] = slidReversedRow.slice().reverse();
  });

  addRandomTile();
}

function slideTiles(row) {
  let result = removeZeroes(row);

  for (let i = 0; i < result.length - 1; i++) {
    if (result[i] === result[i + 1]) {
      result[i] *= 2;
      result[i + 1] = 0;
      score += result[i];
    }
  }

  result = removeZeroes(result);

  while (result.length < BOARD_SIZE) {
    result.push(0);
  }

  return result;
}

function removeZeroes(row) {
  return row.filter(value => value !== 0);
}

function canMerged() {
  let canMerge = false;

  for (let row = 0; row < BOARD_SIZE - 1; row++) {
    for (let col = 0; col < BOARD_SIZE - 1; col++) {
      if (gameBoard[row][col] === gameBoard[row + 1][col]
        || gameBoard[row][col] === gameBoard[row][col + 1]) {
        canMerge = true;

        return canMerge;
      }

      if (
        canMergeInDirection(row, col, 'up')
        || canMergeInDirection(row, col, 'down')
        || canMergeInDirection(row, col, 'left')
        || canMergeInDirection(row, col, 'right')
      ) {
        return true;
      }
    }
  }

  return canMerge;
}

function canMove() {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (gameBoard[row][col] === 0) {
        return true;
      }
    }
  }

  return false;
}

function canMergeInDirection(row, col, direction) {
  switch (direction) {
    case 'up':
      return row > 0 && gameBoard[row][col] === gameBoard[row - 1][col];
    case 'down':
      return row < BOARD_SIZE - 1
        && gameBoard[row][col] === gameBoard[row + 1][col];
    case 'left':
      return col > 0 && gameBoard[row][col] === gameBoard[row][col - 1];
    case 'right':
      return col < BOARD_SIZE - 1
        && gameBoard[row][col] === gameBoard[row][col + 1];
    default:
      return false;
  }
}

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', (evt) => handleKeyPress(evt));
