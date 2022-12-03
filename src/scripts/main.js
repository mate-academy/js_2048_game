'use strict';

let board = [];
let score = 0;
const rows = 4;
const colums = 4;
let lose = false;

const gameScore = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

button.addEventListener('click', (e) => {
  setGame();
  setTow();
  setTow();
  button.classList.replace('start', 'restart');
  button.innerText = 'Restart';
  lose = false;
  gameScore.innerHTML = 0;
  score = 0;

  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
});

document.addEventListener('keyup', (e) => {
  if (lose) {
    return;
  };

  switch (e.code) {
    case 'ArrowLeft':
      slideLeft();
      setTow();
      break;
    case 'ArrowRight':
      slideRight();
      setTow();
      break;
    case 'ArrowUp':
      slideUp();
      setTow();
      break;
    case 'ArrowDown':
      slideDown();
      setTow();
      break;
  };

  gameScore.innerText = score;

  for (let r = 0; r < rows; r++) {
    if (board[r].includes(2048)) {
      messageWin.classList.remove('hidden');
    }
  }
});

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < rows; c++) {
      const tile = document.getElementById(r + '-' + c);
      const num = board[r][c];

      updateTile(tile, num);
    };
  };
};

function setTow() {
  if (!hasEmptyTile()) {
    return;
  };

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * colums);

    if (board[r][c] === 0) {
      board[r][c] = Math.random() > 0.9 ? 4 : 2;

      const tile = document.getElementById(r + '-' + c);

      tile.innerText = board[r][c];
      tile.classList.add('field-cell--' + board[r][c]);
      found = true;
    };
  };
};

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.innerText = num;

    if (num < 2048) {
      tile.classList.add('field-cell--' + num);
    } else {
      tile.classList.add('field-cell--2048');
    };
  };
};

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < colums; c++) {
      if (board[r][c] === 0) {
        return true;
      };
    };
  };

  messageLose.classList.remove('hidden');
  lose = true;

  return false;
};

function filterZero(row) {
  return row.filter(num => num !== 0);
};

function slide(cells) {
  let row = filterZero(cells);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    };
  };

  row = filterZero(row);

  while (row.length < colums) {
    row.push(0);
  };

  return row;
};

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < colums; c++) {
      const tile = document.getElementById(r + '-' + c);
      const num = board[r][c];

      updateTile(tile, num);
    };
  };
};

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);
    row.reverse();
    board[r] = row;

    for (let c = 0; c < colums; c++) {
      const tile = document.getElementById(r + '-' + c);
      const num = board[r][c];

      updateTile(tile, num);
    };
  };
};

function slideUp() {
  for (let c = 0; c < rows; c++) {
    let column = [board[0][c], board[1][c], board[2][c], board[3][c]];

    column = slide(column);

    for (let r = 0; r < rows; r++) {
      board[r][c] = column[r];

      const tile = document.getElementById(r + '-' + c);
      const num = board[r][c];

      updateTile(tile, num);
    };
  };
};

function slideDown() {
  for (let c = 0; c < rows; c++) {
    let column = [board[0][c], board[1][c], board[2][c], board[3][c]];

    column.reverse();
    column = slide(column);
    column.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = column[r];

      const tile = document.getElementById(r + '-' + c);
      const num = board[r][c];

      updateTile(tile, num);
    };
  };
};
