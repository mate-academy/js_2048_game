'use strict';

const scoreElement = document.querySelector('.game-score');
const startBtn = document.querySelector('.start');
const restartBtn = document.querySelector('.restart');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const tCells = document.querySelectorAll('.field-cell');
const cellsArray = Array.from(tCells);

const BOARD_SIZE = 4;
let prevBoardState = [];
let isBlocked = true;
let isLose = false;
let isWin = false;
let gameScore = 0;

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

startBtn.addEventListener('click', () => {
  start();

  startBtn.classList.toggle('hidden', !isBlocked);
  restartBtn.classList.toggle('hidden', isBlocked);
  startMessage.classList.add('hidden');
});

restartBtn.addEventListener('click', () => {
  restartGame();
});

document.addEventListener('keydown', keyEvent => {
  const key = keyEvent.key;

  prevBoardState = board.toString();

  if (isBlocked) {
    return;
  }

  switch (key) {
    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      break;
  }

  isfWinnCheck();

  if (isFreeCellsLeft()) {
    generateRandCell();
  }

  render();
  ifNoChanges();
});

function ifNoChanges() {
  if (prevBoardState === board.toString() && !isFreeCellsLeft()) {
    isLose = true;
    isBlocked = true;
    loseMessage.classList.toggle('hidden', !isLose);
  }
}

function isfWinnCheck() {
  const winnCell = board.flat().find(cell => cell === 2048);

  if (winnCell) {
    isBlocked = true;
    isWin = true;
    restartBtn.classList.toggle('hidden', !isWin);
    winMessage.classList.toggle('hidden', !isWin);
  }
}

function isFreeCellsLeft() {
  return board.flat().filter(cell => cell === 0).length !== 0;
}

function start() {
  isBlocked = false;
  generateRandCell();
  generateRandCell();
  render();
}

function restartGame() {
  gameScore = 0;
  updateScore(0);
  clear();
  board.forEach(row => {
    row.fill(0);
  });
  start();
}

function moveDown() {
  const colums = getColums();

  colums.forEach(column => {
    const updatedCol = slide(column.reverse());

    column.fill(0)
      .splice(0, updatedCol.length, ...updatedCol);
    column.reverse();
  });
  updateBordColums(colums);
}

function moveUp() {
  const colums = getColums();

  colums.forEach(column => {
    const updatedCol = slide(column);

    column.fill(0)
      .splice(0, updatedCol.length, ...updatedCol);
  });
  updateBordColums(colums);
}

function updateBordColums(colums) {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      board[i][j] = colums[j][i];
    }
  }
}

const getColums = () => {
  const columnArr = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    let column = [];

    for (let j = 0; j < BOARD_SIZE; j++) {
      column.push(board[j][i]);
    }
    columnArr.push(column);
    column = [];
  }

  return columnArr;
};

function moveRight() {
  board.forEach(row => {
    const updatedValues = slide(row.reverse());

    row.fill(0)
      .splice(0, updatedValues.length, ...updatedValues);
    row.reverse();
  });
}

function moveLeft() {
  board.forEach(row => {
    const updatedValues = slide(row);

    row.fill(0)
      .splice(0, updatedValues.length, ...updatedValues);
  });
}

function slide(row) {
  const cellValues = filterZeros(row);

  for (let i = 0; i < cellValues.length - 1; i++) {
    if (cellValues[i] === cellValues[i + 1]) {
      cellValues[i] *= 2;
      cellValues[i + 1] = 0;
      gameScore += cellValues[i];
      updateScore(gameScore);
    }
  }

  return filterZeros(cellValues);
}

function updateScore(value) {
  scoreElement.textContent = value;
}

const filterZeros = (row) => row.filter(cell => cell !== 0);

function generateRandCell() {
  const value = Math.random() < 0.9 ? 2 : 4;
  const getRandIndex = () => Math.floor(Math.random() * BOARD_SIZE);
  const row = getRandIndex();
  const cell = getRandIndex();

  if (board[row][cell] === 0) {
    board[row][cell] = value;

    return value;
  } else {
    return generateRandCell();
  }
}

function render() {
  clear();

  const flatBoard = board.flat();

  for (let i = 0; i < flatBoard.length; i++) {
    if (flatBoard[i] !== 0) {
      updateCell(i, flatBoard[i]);
    }
  }
}

function clear() {
  cellsArray.flat().forEach(cell => {
    if (cell.classList.length > 1) {
      cell.classList.remove(cell.classList[1]);
    }
    cell.textContent = '';
  });
}

function updateCell(index, value) {
  cellsArray[index].classList.add(`field-cell--${value}`);
  cellsArray[index].textContent = value;
}
