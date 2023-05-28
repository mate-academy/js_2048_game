'use strict';

const scoreGame = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const gameBoard = document.querySelector('.game-field');

const collums = 4;
const rows = 4;

let board;
let score = 0;
let moveScore = 0;

function emptyTileNumber() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < collums; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function addTileNumber() {
  if (emptyTileNumber()) {
    let rowIndex;
    let cellIndex;

    do {
      rowIndex = Math.floor(Math.random() * rows);
      cellIndex = Math.floor(Math.random() * collums);
    } while (board[rowIndex][cellIndex] !== 0);

    board[rowIndex][cellIndex] = Math.floor(Math.random() <= 0.9 ? 2 : 4);
  } else {
    return null;
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.classList.add(`field-cell--${num}`);
    tile.innerHTML = num;
    moveScore += num;
  }

  if (num === 2048) {
    gameWon();
    document.removeEventListener('keyup', keyEventHandler);
  }

  scoreGame.innerHTML = score;

  if (gameLost()) {
    loseMessage.classList.remove('hidden');
    document.removeEventListener('keyup', keyEventHandler);
  }
}

function renderBoard() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < collums; c++) {
      const tile = gameBoard.rows[r].cells[r];
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function gameWon() {
  winMessage.classList.remove('hidden');
  startButton.classList.replace('restart', 'start');
  startButton.innerText = 'Start';
}

function gameLost() {
  if (emptyTileNumber) {
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < collums - 1; c++) {
      if (board[r][c] === board[r][c + 1]) {
        return false;
      }
    }
  }

  for (let c = 0; c < collums; c++) {
    for (let r = 0; r < rows - 1; r++) {
      if (board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

function slide(row) {
  const noZerosRow = row.filter(cell => cell !== 0);
  const mergedRow = [];
  let mergedValue = 0;

  for (let i = 0; i < noZerosRow.length; i++) {
    if (noZerosRow[i] === noZerosRow[i + 1]) {
      mergedRow.push(noZerosRow[i] * 2);
      mergedValue += noZerosRow[i] * 2;
    } else {
      mergedRow.push(noZerosRow[i]);
    }
  }

  // [4, 2, 0, 0]
  while (mergedRow.length < collums) {
    mergedRow.push(0);
  }

  score += mergedValue;

  return mergedRow;
}

function slideLeft() {
  moveScore = 0;

  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;
  }

  addTileNumber();
  score += moveScore;
  scoreGame.innerHTML = score;
  renderBoard();
}

function slideRight() {
  moveScore = 0;

  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row.reverse());
    board[r] = row.reverse();
  }

  addTileNumber();
  score += moveScore;
  scoreGame.innerHTML = score;
  renderBoard();
}

function slideUp() {
  moveScore = 0;

  for (let c = 0; c < collums; c++) {
    let row = [];

    for (let r = 0; r < rows; r++) {
      row.push(board[r][c]);
    }

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
    }
  }

  addTileNumber();
  score += moveScore;
  scoreGame.innerHTML = score;
  renderBoard();
}

function slideDown() {
  moveScore = 0;

  for (let c = 0; c < collums; c++) {
    let row = [];

    for (let r = 0; r < rows; r++) {
      row.push(board[r][c]);
    }

    row = slide(row.reverse());
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
    }
  }

  addTileNumber();
  score += moveScore;
  scoreGame.innerHTML = score;
  renderBoard();
}

startButton.addEventListener('click', (e) => {
  board = [];
  score = 0;

  for (let r = 0; r < rows; r++) {
    board.push(new Array(collums).fill(0));
  }

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  e.target.classList.replace('start', 'restart');
  e.target.innerHTML = 'Restart';

  document.addEventListener('keyup', keyEventHandler);

  addTileNumber();
  addTileNumber();

  renderBoard();
});

function keyEventHandler(e) {
  switch (e.key) {
    case 'ArrowDown':
      slideDown();
      break;

    case 'ArrowUp':
      slideUp();
      break;

    case 'ArrowLeft':
      slideLeft();
      break;

    case 'ArrowRight':
      slideRight();
      break;
  }
}

document.addEventListener('keyup', keyEventHandler);
