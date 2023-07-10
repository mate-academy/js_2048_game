'use strict';

const startButton = document.querySelector('.start');
const tableRows = document.querySelector('tbody').rows;
const totalScore = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

let board;
let score = 0;
const rows = 4;
const columns = 4;

startButton.addEventListener('click', () => {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;

  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  startButton.classList.add('restart');
  startButton.innerText = 'Restart';

  updateGame();
  generateNewCell();
  generateNewCell();
});

function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (num > 0) {
    cell.innerText = num.toString();
    cell.classList.add(`field-cell--${num.toString()}`);
  }
}

function updateGame() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const currentCell = tableRows[r].cells[c];
      const num = board[r][c];

      updateCell(currentCell, num);
    }
  }

  totalScore.innerText = score.toString();
}

function checkForEmpty() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function generateNewCell() {
  if (!checkForEmpty()) {
    return;
  }

  const randomValue = Math.random() > 0.5 ? 2 : 4;

  while (true) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * columns);

    if (board[row][col] === 0) {
      board[row][col] = randomValue;
      break;
    }

    updateGame();
  }
}

document.addEventListener('keyup', type => {
  switch (startButton.classList.contains('restart')) {
    case type.code === 'ArrowLeft':
      moveLeft();
      generateNewCell();
      break;

    case type.code === 'ArrowRight':
      moveRight();
      generateNewCell();
      break;

    case type.code === 'ArrowUp':
      moveUp();
      generateNewCell();
      break;

    case type.code === 'ArrowDown':
      moveDown();
      generateNewCell();
      break;
  }

  if (!gameLost()) {
    messageForLoser();
  }
});

function gameLost() {
  let check = false;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (r < 3) {
        if (board[r][c] === board[r + 1][c]
          || board[r][c] === board[r][c + 1]) {
          check = true;
        }
      }
    }
  }

  if (!check && !checkForEmpty()) {
    return false;
  }

  return true;
}

function messageForWinner(value) {
  if (value === 2048) {
    messageWin.classList.remove('hidden');
    startButton.classList.remove('restart');
    startButton.innerText = 'Start';
  }
}

function messageForLoser() {
  messageLose.classList.remove('hidden');
  startButton.classList.remove('restart');
  startButton.innerText = 'Start';
}

function filterZero(row) {
  return row.filter(el => el !== 0);
}

function move(row) {
  let newRow = filterZero(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (newRow[i] === newRow[i + 1] && isFinite(newRow[i])) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
      messageForWinner(newRow[i]);
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
}

function moveLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = move(row);
    board[r] = row;
  }

  updateGame();
}

function moveRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = move(row.reverse());
    board[r] = row.reverse();
  }

  updateGame();
}

function moveUp() {
  for (let c = 0; c < columns; c++) {
    let row = [];

    for (let r = 0; r < rows; r++) {
      row.push(board[r][c]);
    }

    row = move(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
    }
  }

  updateGame();
}

function moveDown() {
  for (let c = 0; c < columns; c++) {
    let row = [];

    for (let r = 0; r < rows; r++) {
      row.push(board[r][c]);
    }

    row = move(row.reverse());
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
    }
  }

  updateGame();
}
