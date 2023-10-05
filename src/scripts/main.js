'use strict';

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const button = document.querySelector('.button');
const fieldRows = document.querySelectorAll('.field-row');
const isWinner = document.getElementsByClassName('field-cell--2048');

let board;
let score = 0;
const SIZE = 4;
let tilesMoved = false;

button.addEventListener('click', () => {
  setGame();

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const tile = document.getElementById(`${r}-${c}`);

      tile.innerText = '';
      tile.classList.value = 'field-cell';
      board[r][c] = 0;
    }

    score = 0;
    document.querySelector('.game-score').innerText = 0;
  }

  setTile();
  setTile();

  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  button.classList.remove('start');
  button.classList.add('restart');
  button.innerText = 'Restart';
});

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < fieldRows.length; r++) {
    const fieldRowCells = fieldRows[r].querySelectorAll('.field-cell');

    for (let c = 0; c < fieldRowCells.length; c++) {
      fieldRowCells[c].id = `${r}-${c}`;

      const num = board[r][c];

      updateTile(fieldRowCells[c], num);
    }
  }
}

function hasEmptyTile() {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function searchWinnerCell() {
  if (isWinner.length !== 0) {
    messageWin.classList.remove('hidden');
  }
}

function setTile() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const randomCellNumber = Math.random() <= 0.1 ? 4 : 2;
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);

    if (board[r][c] === 0) {
      board[r][c] = randomCellNumber;

      const tile = document.getElementById(`${r}-${c}`);

      tile.innerText = `${randomCellNumber}`;
      tile.classList.add(`field-cell--${randomCellNumber}`);
      found = true;
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = 'field-cell';

  if (num > 0) {
    tile.innerText = num;
    tile.classList.add(`field-cell--${num}`);
  }
}

document.addEventListener('keyup', (e) => {
  switch (e.code) {
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
    default:
      break;
  }

  if (tilesMoved) {
    setTile();
    searchWinnerCell();
    gameOver();
  }

  tilesMoved = false;
  document.querySelector('.game-score').innerText = score;
});

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function slide(row) {
  let currentRow = row;

  currentRow = filterZero(currentRow);

  for (let i = 0; i < currentRow.length - 1; i++) {
    if (currentRow[i] === currentRow[i + 1]) {
      currentRow[i] *= 2;
      currentRow[i + 1] = 0;
      score += currentRow[i];
    }
  }

  currentRow = filterZero(currentRow);

  while (currentRow.length < SIZE) {
    currentRow.push(0);
  }

  return currentRow;
}

function canTilesSlide() {
  if (hasEmptyTile()) {
    return true;
  }

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const tile = board[r][c];

      if (c > 0 && tile === board[r][c - 1]) {
        return true;
      }

      if (c < SIZE - 1 && tile === board[r][c + 1]) {
        return true;
      }

      if (r > 0 && tile === board[r - 1][c]) {
        return true;
      }

      if (r < SIZE - 1 && tile === board[r + 1][c]) {
        return true;
      }
    }
  }

  return false;
}

function gameOver() {
  if (!canTilesSlide()) {
    messageLose.classList.remove('hidden');
  }
}

function arraysEqual(originalRow, row) {
  if (originalRow.length !== row.length) {
    return false;
  }

  for (let i = 0; i < originalRow.length; i++) {
    if (originalRow[i] !== row[i]) {
      return false;
    }
  }

  return true;
}

function slideLeft() {
  for (let r = 0; r < SIZE; r++) {
    let row = board[r];
    const originalRow = [...row];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < SIZE; c++) {
      const tile = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateTile(tile, num);
    }

    if (!arraysEqual(originalRow, row)) {
      tilesMoved = true;
    }
  }
}

function slideRight() {
  for (let r = 0; r < SIZE; r++) {
    let row = board[r];
    const originalRow = [...row];

    row.reverse();

    row = slide(row);

    row.reverse();
    board[r] = row;

    for (let c = 0; c < SIZE; c++) {
      const tile = document.getElementById(`${r.toString()}-${c.toString()}`);
      const num = board[r][c];

      updateTile(tile, num);
    }

    if (!arraysEqual(originalRow, row)) {
      tilesMoved = true;
    }
  }
}

function slideUp() {
  for (let c = 0; c < SIZE; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const originalRow = [...row];

    row = slide(row);

    for (let r = 0; r < SIZE; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(`${r.toString()}-${c.toString()}`);
      const num = board[r][c];

      updateTile(tile, num);
    }

    if (!arraysEqual(originalRow, row)) {
      tilesMoved = true;
    }
  }
}

function slideDown() {
  for (let c = 0; c < SIZE; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const originalRow = [...row];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < SIZE; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(`${r.toString()}-${c.toString()}`);
      const num = board[r][c];

      updateTile(tile, num);
    }

    if (!arraysEqual(originalRow, row)) {
      tilesMoved = true;
    }
  }
}
