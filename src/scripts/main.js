'use strict';

const button = document.querySelector('button');
const table = document.querySelector('tbody');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');

const size = 4;

function generateEmptyBoard() {
  const emptyBoard = [];

  for (let i = 0; i < size; i++) {
    emptyBoard.push([0, 0, 0, 0]);
  }

  return emptyBoard;
}

let score = 0;
let board = generateEmptyBoard();

function emptyCell() {
  for (let i = 0; i < size; i++) {
    if (board[i].includes(0)) {
      return true;
    }
  }

  return false;
}

function addNewTile() {
  let num;

  if (Math.random() < 0.1) {
    num = 4;
  } else {
    num = 2;
  }

  while (emptyCell()) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);

    if (board[r][c] === 0) {
      board[r][c] = num;
      break;
    }
  }

  updateCells();
}

button.addEventListener('click', start);

function start() {
  board = generateEmptyBoard();
  score = 0;

  button.classList.replace('start', 'restart');

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  button.innerText = 'Restart';

  addNewTile();
  addNewTile();
}

function loseGame() {
  if (emptyCell()) {
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
      const cell = table.rows[r].cells[c];
      const value = board[r][c];

      cell.innerText = '';
      cell.classList.value = '';
      cell.classList.add('field-cell');

      if (value > 0) {
        cell.innerText = value;
        cell.classList.add(`field-cell--${value}`);
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

document.addEventListener('keyup', events => {
  const boardCopy = board.map(arr => arr.slice());

  events.preventDefault();

  switch (events.code) {
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

  if (boardChange(board, boardCopy)) {
    addNewTile();
  }

  updateCells();
});

function boardChange(currentBoard, boardCopy) {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (currentBoard[r][c] !== boardCopy[r][c]) {
        return true;
      }
    }
  }

  return false;
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

function move(direction) {
  for (let i = 0; i < size; i++) {
    let rowOrColumn;

    if (direction === 'left' || direction === 'right') {
      rowOrColumn = board[i];
    } else if (direction === 'up' || direction === 'down') {
      rowOrColumn = [board[0][i], board[1][i], board[2][i], board[3][i]];
    }

    if (direction === 'right' || direction === 'down') {
      rowOrColumn.reverse();
    }

    rowOrColumn = slide(rowOrColumn);

    if (direction === 'right' || direction === 'down') {
      rowOrColumn.reverse();
    }

    if (direction === 'left' || direction === 'right') {
      board[i] = rowOrColumn;
    } else if (direction === 'up' || direction === 'down') {
      for (let j = 0; j < size; j++) {
        board[j][i] = rowOrColumn[j];
      }
    }
  }
}

function moveLeft() {
  move('left');
}

function moveRight() {
  move('right');
}

function moveUp() {
  move('up');
}

function moveDown() {
  move('down');
}
