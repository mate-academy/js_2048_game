'use strict';

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');

const rows = 4;
const columns = 4;
let board;
let scoreCount = 0;
let won = false;

button.addEventListener('click', (e) => {
  messageStart.classList.add('hidden');
  button.innerText = 'Restart';
  button.classList.replace('start', 'restart');

  setGame();
});

button.addEventListener('click', (e) => {
  messageWin.classList.add('hidden');
  won = false;

  clearBoard();
  setGame();
});

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  setTile();
  setTile();
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function loseGame() {
  if (hasEmptyTile()) {
    return false;
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] === board[i][j + 1]) {
        return false;
      }
    }
  }

  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j] === board[i + 1][j]) {
        return false;
      }
    }
  }

  return true;
}

function clearBoard() {
  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = '';
      tile.classList.value = '';
      tile.classList.add('field-cell');
      score.innerText = 0;
      scoreCount = 0;
    });
  });
}

function setTile() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;
  const numb = Math.random() < 0.9 ? 2 : 4;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = numb;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = `${numb}`;
      tile.classList.add('field-cell--' + numb.toString());
      found = true;
    }
  }

  if (loseGame()) {
    messageLose.classList.remove('hidden');

    button.addEventListener('click', () => {
      messageLose.classList.add('hidden');

      clearBoard();
      setGame();
    });
  }
}

function updateTile(r, c) {
  const tile = document.getElementById(r.toString() + '-' + c.toString());
  const num = board[r][c];

  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.innerText = num.toString();
    tile.classList.add('field-cell' + '--' + num.toString());
  }

  if (num === 2048) {
    messageWin.classList.remove('hidden');
    won = true;
  }
}

document.addEventListener('keyup', (e) => {
  e.preventDefault();

  if (won) {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      slideLeft();
      setTile();
      break;
    case 'ArrowRight':
      slideRight();
      setTile();
      break;
    case 'ArrowUp':
      slideUp();
      setTile();
      break;
    case 'ArrowDown':
      slideDown();
      setTile();
      break;
  }
});

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(newRow) {
  let row = newRow;

  row = filterZero(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      scoreCount += row[i];
      score.innerText = scoreCount;
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
      updateTile(r, c);
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
      updateTile(r, c);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      updateTile(r, c);
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

      updateTile(r, c);
    }
  }
}
