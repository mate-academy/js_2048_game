'use strict';

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');
const button = document.querySelector('button');
const table = document.querySelector('tbody');
const size = 4;

let score = 0;
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

button.addEventListener('click', setGame);

function hasEmptyCell() {
  for (let r = 0; r < size; r++) {
    if (board[r].includes(0)) {
      return true;
    }
  }

  return false;
}

function getRandomNumber() {
  const num = Math.random() < 0.1 ? 4 : 2;

  while (hasEmptyCell()) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);

    if (board[r][c] === 0) {
      board[r][c] = num;
      break;
    }
  }

  updateCells();
}

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;

  button.classList.replace('start', 'restart');

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  button.innerText = 'Restart';

  getRandomNumber();
  getRandomNumber();
}

document.addEventListener('keyup', evnt => {
  const boardCopy = board.map(arr => arr.slice());

  evnt.preventDefault();

  switch (evnt.code) {
    case 'ArrowLeft':
      slideLeft();
      break;

    case 'ArrowRight':
      slideRight();
      break;

    case 'ArrowUp':
      slideUp();
      break;

    case 'ArrowDown':
      slideDown();
      break;
  }

  if (hasBoardChanged(board, boardCopy)) {
    getRandomNumber();
  }

  updateCells();
});

function hasBoardChanged(currentBoard, boardCopy) {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (currentBoard[r][c] !== boardCopy[r][c]) {
        return true;
      }
    }
  }

  return false;
}

function loseGame() {
  if (hasEmptyCell()) {
    return false;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size - 1; c++) {
      if (board[r][c] === board[r][c + 1]) {
        return false;
      }
    }
  }

  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

function updateCells() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const currentCell = table.rows[r].cells[c];
      const value = board[r][c];

      currentCell.innerText = '';
      currentCell.classList.value = '';
      currentCell.classList.add('field-cell');

      if (value > 0) {
        currentCell.innerText = value;
        currentCell.classList.add(`field-cell--${value}`);
      }

      if (value === 2048) {
        messageWin.classList.remove('hidden');
        button.classList.replace('restart', 'start');
        button.innerText = 'Start';
      }
    }
  }

  gameScore.innerText = score;

  if (loseGame()) {
    messageLose.classList.remove('hidden');
  }
}

function slide(row) {
  let newRow = row.filter(el => el !== 0);

  for (let i = 0; i < size - 1; i++) {
    if (newRow[i] === newRow[i + 1] && isFinite(newRow[i])) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  newRow = newRow.filter(el => el !== 0);

  while (newRow.length < size) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  for (let r = 0; r < size; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;
  }
}

function slideRight() {
  for (let r = 0; r < size; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);
    row.reverse();
    board[r] = row;
  }
}

function slideUp() {
  for (let c = 0; c < size; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < size; r++) {
      board[r][c] = row[r];
    }
  }
}

function slideDown() {
  for (let c = 0; c < size; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < size; r++) {
      board[r][c] = row[r];
    }
  }
}
