'use strict';

const scoreGame = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const gameBoard = document.querySelector('.game-field');

const collums = 4;
const rows = 4;

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let score = 0;
let slideScore = 0;

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

    board[rowIndex][cellIndex] = Math.floor(Math.random() < 0.9 ? 2 : 4);
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
    slideScore += num;
  }

  if (num === 2048) {
    winMessage.classList.remove('hidden');
    startButton.classList.replace('restart', 'start');
    startButton.innerText = 'Start';
    document.removeEventListener('keyup', keyEventHandler);
  }
}

function updateBoard() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < collums; c++) {
      const tile = gameBoard.rows[r].cells[c];
      const num = board[r][c];

      updateTile(tile, num);
    }
  }

  scoreGame.innerHTML = score;

  if (gameLost()) {
    loseMessage.classList.remove('hidden');
    document.removeEventListener('keyup', keyEventHandler);
  }
}

function gameLost() {
  if (emptyTileNumber()) {
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
  const oneToTwoRow = [];
  let oneToTwoValue = 0;

  for (let i = 0; i < noZerosRow.length; i++) {
    if (noZerosRow[i] === noZerosRow[i + 1]) {
      oneToTwoRow.push(noZerosRow[i] * 2);
      oneToTwoValue += noZerosRow[i] * 2;
      noZerosRow[i + 1] = 0;
    } else {
      oneToTwoRow.push(noZerosRow[i]);
    }
  }

  while (oneToTwoRow.length < collums) {
    oneToTwoRow.push(0);
  }

  score += oneToTwoValue;

  return oneToTwoRow;
}

function slideLeft() {
  slideScore = 0;

  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;
  }

  addTileNumber();
  score += slideScore;
  scoreGame.innerHTML = score;
  updateBoard();
}

function slideRight() {
  slideScore = 0;

  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row.reverse());
    board[r] = row.reverse();
  }

  addTileNumber();
  score += slideScore;
  scoreGame.innerHTML = score;
  updateBoard();
}

function slideUp() {
  slideScore = 0;

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
  score += slideScore;
  scoreGame.innerHTML = score;
  updateBoard();
}

function slideDown() {
  slideScore = 0;

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
  score += slideScore;
  scoreGame.innerHTML = score;
  updateBoard();
}

startButton.addEventListener('click', (e) => {
  board.forEach(row => row.fill(0));
  score = 0;

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  e.target.classList.replace('start', 'restart');
  e.target.innerHTML = 'Restart';

  document.addEventListener('keyup', keyEventHandler);

  addTileNumber();
  addTileNumber();

  updateBoard();
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
