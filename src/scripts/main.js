'use strict';

let board;
let score = 0;
const rows = 4;
const cols = 4;

document.querySelector('.start')
  .addEventListener('click', () => {
    document.querySelector('.start').textContent = 'Restart';
    document.querySelector('button').classList.add('restart');
    document.querySelector('.start').classList.remove('start');
    document.querySelector('.message-start').classList.add('hidden');
    start();
  });

function generateBoard() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');

      cell.id = `${r}-${c}`;

      const num = board[r][c];

      updateCell(cell, num);

      document.querySelector('.game-field').append(cell);
    }
  }
}

function start() {
  addFirstTwoCells();

  document.addEventListener('keyup', trackKey);
}

function restart() {
  document.querySelector('.restart')
    .addEventListener('click', () => {
      score = 0;
      document.querySelector('.message-lose').classList.add('hidden');
      document.querySelector('.message-win').classList.add('hidden');
      clearField();
      start();
    });
}

function win() {
  document.querySelector('.message-win').classList.remove('hidden');
  document.removeEventListener('keyup', trackKey);
  restart();
}

function addFirstTwoCells() {
  for (let i = 0; i < 2; i++) {
    let prevRow = -1;
    let prevCol = -1;
    const row = getRandomInt(4);
    const col = getRandomInt(4);

    if (col === prevCol && row === prevRow) {
      i--;
      continue;
    }

    board[row][col] = 2;

    const cell = document.getElementById(`${row}-${col}`);

    cell.classList.add('.field-cell--2');

    updateCell(cell, 2);

    prevRow = row;
    prevCol = col;
  }
}

const trackKey = (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      if (!hasSpace()) {
        document.querySelector('.message-lose').classList.remove('hidden');

        restart();
        break;
      }

      moveLeft();
      generateCell();
      break;

    case 'ArrowRight':
      if (!hasSpace()) {
        document.querySelector('.message-lose').classList.remove('hidden');

        restart();
        break;
      }

      moveRight();
      generateCell();
      break;

    case 'ArrowUp':
      if (!hasSpace()) {
        document.querySelector('.message-lose').classList.remove('hidden');

        restart();
        break;
      }

      moveUp();
      generateCell();
      break;

    case 'ArrowDown':
      if (!hasSpace()) {
        document.querySelector('.message-lose').classList.remove('hidden');

        restart();
        break;
      }

      moveDown();
      generateCell();
      break;
  }
  document.querySelector('.game-score').textContent = score;
};

function clearField() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      board[r][c] = 0;

      const cell = document.getElementById(`${r}-${c}`);

      updateCell(cell, 0);
    }
  }
}

function updateCell(cell, num) {
  cell.classList.value = '';
  cell.textContent = (num === 0) ? ' ' : `${num}`;
  cell.classList.add('field-cell');
  cell.classList.add(`field-cell--${num}`);
}

function slide(argRow) {
  const row = argRow;

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  const newRow = row.filter(el => el !== 0);

  for (let i = 0; i < rows; i++) {
    if (!newRow[i]) {
      newRow[i] = 0;
    }
  }

  return newRow;
}

function moveLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r].filter(el => el !== 0);

    row = slide(row);

    board[r] = row;

    for (let c = 0; c < cols; c++) {
      const cell = document.getElementById(`${r}-${c}`);

      const num = board[r][c];

      updateCell(cell, num);

      if (board[r][c] === 2048) {
        win();
      }
    }
  }
}

function moveRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r].filter(el => el !== 0);

    row.reverse();

    row = slide(row);

    board[r] = row.reverse();

    for (let c = 0; c < cols; c++) {
      const cell = document.getElementById(`${r}-${c}`);

      const num = board[r][c];

      updateCell(cell, num);

      if (board[r][c] === 2048) {
        win();
      }
    }
  }
}

function moveUp() {
  for (let c = 0; c < cols; c++) {
    let col = board.map(row => row[c]);

    col = slide(col);

    for (let r = 0; r < rows; r++) {
      board[r][c] = col[r];

      const cell = document.getElementById(`${r}-${c}`);

      const num = board[r][c];

      updateCell(cell, num);

      if (board[r][c] === 2048) {
        win();
      }
    }
  }
}

function moveDown() {
  for (let c = 0; c < cols; c++) {
    let col = board.map(row => row[c]);

    col = col.reverse();

    col = slide(col);

    col = col.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = col[r];

      const cell = document.getElementById(`${r}-${c}`);

      const num = board[r][c];

      updateCell(cell, num);

      if (board[r][c] === 2048) {
        win();
      }
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function hasSpace() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c]) {
        return true;
      }
    }
  }

  return false;
}

function generateTenPercentNumber() {
  const arr = [];

  for (let i = 0; i < 10; i++) {
    arr[i] = 4;
  }

  for (let i = 10; i < 100; i++) {
    arr[i] = 2;
  }

  const index = getRandomInt(100);

  return arr[index];
}

function generateCell() {
  if (!hasSpace()) {
    return;
  }

  let bool = false;

  while (!bool) {
    const col = getRandomInt(4);
    const row = getRandomInt(4);

    if (board[row][col] === 0) {
      const cell = document.getElementById(`${row}-${col}`);

      const num = generateTenPercentNumber();

      board[row][col] = num;
      cell.textContent = num;
      cell.classList.add(`field-cell--${num}`);
      bool = true;
    }
  }
}

window.onload = generateBoard();
