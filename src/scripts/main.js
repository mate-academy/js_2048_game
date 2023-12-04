'use strict';

const messegLose = document.querySelector('.message-lose');
const messegWin = document.querySelector('.message-win');
const messegStart = document.querySelector('.message-start');
const Startbutton = document.querySelector('.start');
const Restarttbutton = document.querySelector('.restart');
const scoreTable = document.querySelector('.game-score');
const tiles = document.getElementsByClassName('tile');

const rows = 4;
const columns = 4;
let score = 0;
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let stopGame = false;

Startbutton.addEventListener('click', () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.createElement('div');
      const num = board[r][c];

      tile.id = r.toString() + '-' + c.toString();

      upDateTile(tile, num);
      document.getElementById('board').append(tile);
    }
  }

  Startbutton.classList.add('hidden');
  messegStart.classList.add('hidden');
  Restarttbutton.classList.remove('hidden');

  addNum();
  addNum();
});

Restarttbutton.addEventListener('click', function restartGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const tileArr = Array.from(tiles);

  tileArr.forEach((tile) => {
    tile.innerText = '';
    tile.className = 'tile';
  });

  score = 0;
  scoreTable.innerHTML = score;
  messegLose.classList.add('hidden');
  messegWin.classList.add('hidden');
  addNum();
  addNum();
});

function endGame() {
  if (gameOver()) {
    stopGame = false;
    messegLose.classList.remove('hidden');
  }
}

function empty() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function addNum() {
  if (!empty()) {
    return true;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      const num = Math.random() < 0.01 ? 4 : 2; // Fix the missing parentheses

      board[r][c] = num;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = num.toString();
      tile.classList.add(`tile--${num}`);
      found = true;
    }
  }
}

function upDateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('tile');

  if (num > 0) {
    tile.innerText = num.toString();

    if (num <= 2048) {
      tile.classList.add(`tile--${num}`);
    }

    if (num === 2048) {
      messegWin.classList.remove('hidden');
    }
  }
}

document.addEventListener('keydown', even => {
  if (stopGame) {
    return false;
  }

  switch (even.key) {
    case 'ArrowLeft':
      slideLeft();
      addNum();
      break;

    case 'ArrowRight':
      slideRight();
      addNum();
      break;

    case 'ArrowDown':
      slideDown();
      addNum();
      break;

    case 'ArrowUp':
      slideUp();
      addNum();
      break;
  }

  scoreTable.innerText = score;
});

function filterZeros(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let r = row;

  r = filterZeros(r);

  for (let i = 0; i < r.length; i++) {
    if (r[i] === r[i + 1]) {
      r[i] *= 2;
      r[i + 1] = 0;
      score += r[i];
    }
  }

  r = filterZeros(r);

  while (r.length < columns) {
    r.push(0);
  }

  return r;
}

function slideLeft() {
  endGame();

  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      upDateTile(tile, num);
    }
  }
}

function slideRight() {
  endGame();

  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);
    board[r] = row.reverse();

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      upDateTile(tile, num);
    }
  }
}

function slideUp() {
  endGame();

  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      upDateTile(tile, num);
    }
  }
}

function slideDown() {
  endGame();

  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      upDateTile(tile, num);
    }
  }
}

function gameOver() {
  if (empty()) {
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const rc = board[r][c];

      if (c < columns - 1 && rc === board[r][c + 1]) {
        return false;
      }

      if (r < rows - 1 && rc === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}
