'use strict';

// write your code here
const fieldOfGame = document.querySelector('tbody');
const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const rowsOfCells = 4;
let board;
let points = 0;

button.addEventListener('click', () => {
  button.classList.replace('start', 'restart');
  button.innerText = 'Restart';
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  startGame();
});

function startGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  points = 0;
  gameScore.innerText = points;

  placeBlocks();
  placeBlocks();
}

function emptyBlock() {
  for (let i = 0; i < rowsOfCells; i++) {
    if (board[i].includes(0)) {
      return true;
    }
  }

  return false;
}

function placeBlocks() {
  while (emptyBlock()) {
    const randomRow = Math.floor((Math.random() * rowsOfCells));
    const randomCol = Math.floor((Math.random() * rowsOfCells));

    if (board[randomRow][randomCol] === 0) {
      const number = Math.random() < 0.9 ? 2 : 4;

      board[randomRow][randomCol] = number;
      break;
    }
  }

  setCells();
}

function loseGame() {
  if (emptyBlock()) {
    return false;
  }

  for (let r = 0; r < rowsOfCells; r++) {
    for (let c = 0; c < rowsOfCells; c++) {
      if (board[r][c] === board[r][c + 1]) {
        return false;
      }
    }
  }

  for (let r = 0; r < rowsOfCells - 1; r++) {
    for (let c = 0; c < rowsOfCells; c++) {
      if (board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

function setCells() {
  for (let r = 0; r < rowsOfCells; r++) {
    for (let c = 0; c < rowsOfCells; c++) {
      const currentCell = fieldOfGame.rows[r].cells[c];
      const num = board[r][c];

      currentCell.innerText = '';
      currentCell.classList.value = '';
      currentCell.classList.add('field-cell');

      if (num > 0) {
        currentCell.innerText = num;
        currentCell.classList.add(`field-cell--${num}`);
      }

      if (num === 2048) {
        messageWin.classList.remove('hidden');
        button.classList.replace('restart', 'start');
      }
    }
  }

  if (loseGame()) {
    messageLose.classList.remove('hidden');
  }
}

function removeEmptyBlocks(row) {
  return row.filter(num => num !== 0);
}

function move(row) {
  let newRow = removeEmptyBlocks(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      points += newRow[i];

      gameScore.innerText = points;
    }
  }

  newRow = removeEmptyBlocks(newRow);

  while (newRow.length < rowsOfCells) {
    newRow.push(0);
  }

  return newRow;
}

function moveLeft() {
  for (let r = 0; r < rowsOfCells; r++) {
    let row = board[r];

    row = move(row);
    board[r] = row;
  }
}

function moveRight() {
  for (let r = 0; r < rowsOfCells; r++) {
    let row = board[r].reverse();

    row = move(row).reverse();
    board[r] = row;
  }
}

function moveUp() {
  for (let c = 0; c < rowsOfCells; c++) {
    let column = [board[0][c], board[1][c], board[2][c], board[3][c]];

    column = move(column);

    for (let r = 0; r < rowsOfCells; r++) {
      board[r][c] = column[r];
    }
  }
}

function moveDown() {
  for (let c = 0; c < rowsOfCells; c++) {
    let column = [board[0][c], board[1][c], board[2][c], board[3][c]].reverse();

    column = move(column).reverse();

    for (let r = 0; r < rowsOfCells; r++) {
      board[r][c] = column[r];
    }
  }
}

function saveBoardState() {
  return JSON.parse(JSON.stringify(board));
}

function isBoardStateChanged(originalBoard, newBoard) {
  return JSON.stringify(originalBoard) !== JSON.stringify(newBoard);
}

document.addEventListener('keyup', (e) => {
  e.preventDefault();

  const originalBoard = saveBoardState();

  switch (e.code) {
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

  if (isBoardStateChanged(originalBoard, board)) {
    placeBlocks();
    setCells();
  }
});
