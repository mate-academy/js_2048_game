'use strict';

const gameField = document.querySelector('.game-field').tBodies[0];
const button = document.querySelector('.controls .button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const scoreHTML = document.querySelector('.game-score');

const MAX_ROWS = 4;
const MAX_COLS = 4;
const WIN_SCORE = 2048;

const tiles = Array.from(Array(MAX_ROWS), () => new Array(MAX_COLS));
let availableCells = [];
let score = 0;
let isWin = false;

button.addEventListener('click', onStart);

function onStart(e) {
  if (!e.target.matches('.button')) {
    return;
  }

  if (e.target.classList.contains('start')) {
    e.target.classList.remove('start');
    e.target.classList.add('restart');
    e.target.textContent = 'Restart';

    document.body.addEventListener('keydown', onKeyDown);
  }

  start();
}

function start() {
  reset();
  updateInfo();
  render();
}

function render() {
  [...gameField.rows].forEach((row, rowIdx) => {
    [...row.cells].forEach((cell, cellIdx) => {
      cell.className = 'field-cell';

      if (tiles[rowIdx][cellIdx] !== 0) {
        cell.classList.add(`field-cell--${tiles[rowIdx][cellIdx]}`);
        cell.textContent = tiles[rowIdx][cellIdx];
      } else {
        cell.textContent = '';
      }
    });
  });

  scoreHTML.textContent = score;
}

function reset() {
  tiles.forEach(row => row.fill(0));
  availableCells = [];

  score = 0;

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');
}

function updateInfo() {
  if (isWin) {
    win();
  }

  availableCells = [];

  tiles.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      if (cell === 0) {
        availableCells.push({
          row: rowIdx,
          col: cellIdx,
        });
      }
    });
  });

  if (availableCells.length > 0) {
    const { position, value } = generateNewCell();

    if (position.row < MAX_ROWS && position.col < MAX_COLS) {
      tiles[position.row][position.col] = value;
    }

    availableCells.splice(
      availableCells.indexOf({
        row: position.row,
        col: position.col,
      }),
      1
    );
  }

  // no cells available AND there are no same cells next to each other
  if (availableCells.length === 0) {
    lose();
  }
}

function lose() {
  document.body.removeEventListener('keydown', onKeyDown);
  messageLose.classList.remove('hidden');

  button.classList.remove('restart');
  button.classList.add('start');
  button.textContent = 'Start';
}

function win() {
  document.body.removeEventListener('keydown', onKeyDown);
  messageWin.classList.remove('hidden');

  button.classList.remove('restart');
  button.classList.add('start');
  button.textContent = 'Start';
}

function onKeyDown(e) {
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    return;
  }

  const direction = e.code.replace('Arrow', '');

  if (tryMoveCell(direction)) {
    updateInfo();
  }

  render();
}

function tryMoveCell(direction) {
  switch (direction) {
    case 'Left':
    case 'Right':
      return tryMoveHorizontally(direction);
    case 'Up':
    case 'Down':
      return tryMoveVertically(direction);
  }

  return false;
}

function tryMoveHorizontally(direction) {
  let wasMoved = false;

  for (let i = 0; i < MAX_ROWS; i++) {
    let row = tiles[i].filter(cell => cell);

    if (direction === 'Right') {
      row.reverse();
    }

    collapseCells(row);

    row = row.concat(Array(MAX_COLS - row.length).fill(0));

    if (direction === 'Right') {
      row.reverse();
    }

    wasMoved = wasMoved || row.some((cell, idx) => cell !== tiles[i][idx]);

    tiles[i] = row;
  }

  return wasMoved;
}

function tryMoveVertically(direction) {
  let wasMoved = false;

  for (let col = 0; col < MAX_COLS; col++) {
    let column = tiles.map(row => row[col]).filter(cell => cell);

    if (direction === 'Down') {
      column.reverse();
    }

    collapseCells(column);

    column = column.concat(Array(MAX_ROWS - column.length).fill(0));

    if (direction === 'Down') {
      column.reverse();
    }

    wasMoved = wasMoved || column.some((cell, idx) => cell !== tiles[idx][col]);

    for (let row = 0; row < MAX_ROWS; row++) {
      tiles[row][col] = column[row];
    }
  }

  return wasMoved;
}

function collapseCells(row) {
  for (let j = 0; j < row.length - 1; j++) {
    if (row[j] === row[j + 1]) {
      row[j] *= 2;

      // TODO: remove from here
      if (row[j] === WIN_SCORE) {
        isWin = true;
      }

      score += row[j];
      row.splice(j + 1, 1);
    }
  }
}

function generateNewCell() {
  const position = Math.floor(Math.random() * availableCells.length);
  const value = Math.random() < 0.9 ? 2 : 4;

  return {
    position: availableCells[position],
    value,
  };
}
