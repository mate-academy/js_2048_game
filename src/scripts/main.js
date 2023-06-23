'use strict';

const start = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const fieldCell = document.getElementsByClassName('field-cell');
const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const prevBoard = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
];

start.addEventListener('click', () => {
  if (start.classList.contains('start')) {
    start.classList.remove('start');
    start.classList.add('restart');
    start.textContent = 'Restart';
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    setNewNumber();
    setNewNumber();
  } else if (start.classList.contains('restart')) {
    start.classList.remove('restart');
    start.classList.add('start');
    start.textContent = 'Start';
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    restart();
  }
});

function restart() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      const cell = document.getElementById(`${i}-${j}`);

      board[i][j] = 0;

      const num = board[i][j];

      updateCell(cell, num);
    }
  }
  score = 0;

  gameScore.innerText = 0;
}

document.addEventListener('keyup', (e) => {
  if (start.classList.contains('start')) {
    return;
  }

  updatePrevBoard();

  switch (e.code) {
    case 'ArrowLeft':
      moveLeft();
      setNewNumber();
      break;

    case 'ArrowRight':
      moveRight();
      setNewNumber();
      break;

    case 'ArrowUp':
      moveUp();
      setNewNumber();
      break;

    case 'ArrowDown':
      moveDown();
      setNewNumber();
      break;
  }

  gameScore.innerText = score;

  if (score === 2048) {
    messageWin.classList.remove('hidden');
    start.classList.replace('restart', 'start');
    start.innerText = 'Start';
  }

  if (gameOver()) {
    messageLose.classList.remove('hidden');
  }
});

let index = 0;

for (let r = 0; r < board.length; r++) {
  for (let c = 0; c < board.length; c++) {
    fieldCell[index++].id = r.toString() + '-' + c.toString();
  }
}

let score = 0;

function slide(row) {
  row.filter(num => num !== 0);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  const rowNew = row.filter(num => num !== 0);

  while (rowNew.length < board.length) {
    rowNew.push(0);
  }

  return rowNew;
}

function moveLeft() {
  for (let r = 0; r < board.length; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < board.length; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());

      const value = board[r][c];

      updateCell(cell, value);
    }
  }
}

function moveRight() {
  for (let r = 0; r < board.length; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);
    board[r] = row.reverse();

    for (let c = 0; c < board.length; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());

      const value = board[r][c];

      updateCell(cell, value);
    }
  }
}

function moveUp() {
  for (let c = 0; c < board.length; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < board.length; r++) {
      board[r][c] = row[r];

      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const value = board[r][c];

      updateCell(cell, value);
    }
  }
}

function moveDown() {
  for (let c = 0; c < board.length; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < board.length; r++) {
      board[r][c] = row[r];

      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const value = board[r][c];

      updateCell(cell, value);
    }
  }
}

function isBoardEqual() {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      if (board[r][c] !== prevBoard[r][c]) {
        return false;
      }
    }
  }

  return true;
}

function updatePrevBoard() {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      prevBoard[i][j] = board[i][j];
    }
  }
}

function setNewNumber() {
  if (!hasEmptyCell() || isBoardEqual()) {
    return;
  }

  let found = false;

  while (!found) {
    const value = Math.random() > 0.1 ? 2 : 4;
    const r = Math.floor(Math.random() * board.length);
    const c = Math.floor(Math.random() * board.length);

    if (board[r][c] === 0) {
      board[r][c] = value;

      const cell = document.getElementById(r.toString() + '-' + c.toString());

      cell.innerText = value;

      updateCell(cell, value);

      found = true;
    }
  }
}

function hasEmptyCell() {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function updateCell(cell, value) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (value > 0) {
    cell.innerText = value.toString();

    if (value <= 2048) {
      cell.classList.add('field-cell--' + value.toString());
    }
  }
}

function gameOver() {
  if (hasEmptyCell()) {
    return false;
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      const current = board[i][j];

      if ((i + 1 < board.length && current === board[i + 1][j])
       || (j + 1 < board.length && current === board[i][j + 1])) {
        return false;
      }
    }
  }

  return true;
}
