/* eslint-disable no-param-reassign */
'use strict';

const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('tbody');
let score = 0;
const rows = 4;
const columns = 4;
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function getRandomCell() {
  if (!hasEmptyCell()) {
    return;
  }

  const r = Math.floor(Math.random() * rows);
  const c = Math.floor(Math.random() * columns);

  if (board[r][c] === 0) {
    board[r][c] = 2;
    updateGame();
  } else {
    getRandomCell();
  }
}

function hasEmptyCell() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function winGame() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 2048) {
        messageWin.classList.remove('hidden');
      }
    }
  }
}

startButton.addEventListener('click', () => {
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  score = 0;
  gameScore.textContent = score;

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  getRandomCell();
  getRandomCell();
});

function updateGame() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = gameField.children[r].children[c];
      const num = board[r][c];

      cell.textContent = '';
      cell.classList.value = '';
      cell.classList.add('field-cell');

      if (num > 0) {
        cell.classList.add(`field-cell--${num}`);
        cell.textContent = num;
      }
    }
  }
}

document.addEventListener('keydown', ev => {
  if (ev.key === 'ArrowLeft') {
    moveLeft();
    getRandomCell();
  }

  if (ev.key === 'ArrowRight') {
    moveRight();
    getRandomCell();
  }

  if (ev.key === 'ArrowUp') {
    moveUp();
    getRandomCell();
  }

  if (ev.key === 'ArrowDown') {
    moveDown();
    getRandomCell();
  }

  gameScore.textContent = score;

  if (!hasEmptyCell()) {
    messageLose.classList.remove('hidden');
  }

  winGame();
});

function slide(row) {
  row = row.filter(el => el !== 0);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  row = row.filter(el => el !== 0);

  while (row.length < rows) {
    row.push(0);
  }

  return row;
}

function moveLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    updateGame();
  }
}

function moveRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);
    board[r] = row.reverse();

    updateGame();
  }
}

function moveUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];

    updateGame();
  }
}

function moveDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];

    updateGame();
  }
}
