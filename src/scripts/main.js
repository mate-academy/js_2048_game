'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;
const field = document.querySelector('tbody');
const button = document.querySelector('button');
const startingMsg = document.querySelector('.message-start');
const winnigMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');

button.addEventListener('click', buttonHandler);

function buttonHandler() {
  score = 0;
  document.querySelector('.game-score').innerText = score;

  if (button.classList.contains('start')) {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    startingMsg.classList.add('hidden');
    setEmptyBoard();
  } else {
    winnigMsg.classList.add('hidden');
    loseMsg.classList.add('hidden');
    setEmptyBoard();
  }
}

function setEmptyBoard() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const gameCell = field.rows[i].cells[j];
      const num = board[i][j];

      updateTile(gameCell, num);
    }
  }
  setBoard();
  setBoard();
}

function isEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < rows; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function setBoard() {
  if (!isEmptyTile()) {
    return;
  }

  let check = false;

  while (!check) {
    const row = Math.floor(Math.random() * rows);
    const cell = Math.floor(Math.random() * columns);

    if (board[row][cell] === 0) {
      const tile = field.rows[row].cells[cell];

      board[row][cell] = Math.random() >= 0.9 ? 4 : 2;
      tile.innerText = board[row][cell];
      tile.classList.add(`field-cell--${board[row][cell]}`);
    }
    check = true;
  }
}

document.addEventListener('keyup', (e) => {
  const pressedKey = e.key;

  switch (pressedKey) {
    case 'ArrowUp':
      slideUp();
      setBoard();
      break;
    case 'ArrowDown':
      slideDown();
      setBoard();
      break;
    case 'ArrowLeft':
      slideLeft();
      setBoard();
      break;
    case 'ArrowRight':
      slideRight();
      setBoard();
      break;

    default:
      break;
  }
});

function updateTile(tile, num) {
  tile.innerText = '';
  tile.className = 'field-cell';
  document.querySelector('.game-score').textContent = score.toString();

  if (num > 0) {
    tile.innerText = num.toString();
    tile.classList.add(`field-cell--${num}`);

    if (num === 2048) {
      winnigMsg.classList.remove('hidden');

      return;
    }
  }

  gameHasMove();
}

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function slide(row) {
  row = filterZero(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
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
      const cell = field.rows[r].cells[c];

      const num = board[r][c];

      updateTile(cell, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();

    row = slide(row);
    row.reverse();
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const cell = field.rows[r].cells[c];

      const num = board[r][c];

      updateTile(cell, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const cell = field.rows[r].cells[c];

      const num = board[r][c];

      updateTile(cell, num);
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

      const cell = field.rows[r].cells[c];

      const num = board[r][c];

      updateTile(cell, num);
    }
  }
}

function gameHasMove() {
  if (isEmptyTile()) {
    return;
  }

  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < columns - 1; cell++) {
      const isNextSame = board[row][cell] === board[row][cell + 1];
      const isBelowSame = board[cell][row] === board[cell + 1][row];

      if (isNextSame || isBelowSame) {
        return;
      }
    }
  }
  loseMsg.classList.remove('hidden');
}
