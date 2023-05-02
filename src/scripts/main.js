'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;

const startButton = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

startButton.addEventListener('click', () => {
  setGame();

  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.innerText = 'Restart';

  messageStart.classList.add('hidden');
});

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  gameScore.textContent = score;

  const tiles = document.querySelectorAll('.tile');

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = tiles[r * rows + c];

      tile.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateTile(tile, num);
    }
  }
  setTwo();
  setTwo();
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('tile');

  if (num > 0) {
    tile.innerText = num.toString();
    tile.classList.add(`tile--${num}`);
  }
}

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      slideLeft();
      setTwo();
      break;
    case 'ArrowRight':
      slideRight();
      setTwo();
      break;
    case 'ArrowUp':
      slideUp();
      setTwo();
      break;
    case 'ArrowDown':
      slideDown();
      setTwo();
      break;
  }
});

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(r) {
  let row = r;

  row = filterZero(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
      gameScore.innerText = score;
    }

    if (row[i] === 2048) {
      messageStart.classList.add('hidden');
      messageWin.classList.remove('hidden');
    }
  }

  row = filterZero(row);

  while (row.length < columns) {
    row.push(0);
  }

  return row;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);
    board[r] = row.reverse();

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = 2;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = '2';
      tile.classList.add(`tile--2`);
      found = true;
    }
  }
}

function hasEmptyTile() {
  let canMove = false;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }

      if (c < columns - 1 && board[r][c] === board[r][c + 1]) {
        canMove = true;
      }

      if (r < rows - 1 && board[r][c] === board[r + 1][c]) {
        canMove = true;
      }
    }
  }

  if (!canMove) {
    messageStart.classList.add('hidden');
    messageLose.classList.remove('hidden');
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.innertext = 'Start';
  }

  return false;
}
