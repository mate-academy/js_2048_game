'use strict';

const gameField = document.querySelector('.game-field').tBodies[0];
const button = document.querySelector('.controls .button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const scoreHTML = document.querySelector('.game-score');

const MAX_ROWS = 4;
const MAX_COLS = 4;

const tiles = Array.from(Array(MAX_ROWS), () => new Array(MAX_COLS));
let availablePositions = [];
let score = 0;

button.addEventListener('click', onStart);

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

  score = 0;

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');
}

function updateInfo() {
  availablePositions = [];

  tiles.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      if (cell === 0) {
        availablePositions.push({
          row: rowIdx,
          col: cellIdx,
        });
      }
    });
  });

  if (availablePositions.length === 0) {
    lose();
  } else {
    const { row, col, value } = generateNewCell();

    if (row < MAX_ROWS && col < MAX_COLS) {
      tiles[row][col] = value;
    } else {
      alert(`Generated pos is out of bounds row=${row} col=${col}`);
    }
  }
}

function lose() {
  document.body.removeEventListener('keydown', onKeyDown);
  messageLose.classList.remove('hidden');

  button.classList.remove('restart');
  button.classList.add('start');
  button.textContent = 'Start';
}

function onKeyDown(e) {
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    return;
  }

  if (!canBeMoved(e.code.replace('Arrow', ''))) {
    alert(`Cannot move tiles in direction ${e.code}`);

    return;
  }

  moveTiles(e.code.replace('Arrow', ''));
  updateInfo();
  render();
}

function canBeMoved(direction) {
  let movePossible = false;

  switch (direction) {
    case 'Up':
      break;

    case 'Down':
      break;

    case 'Left':
      tiles.some((row) => {
        if (
          (row[0] === 0
            && row.some((cell, idx) => cell !== 0 && idx >= 1))
          || (row[0] !== 0
            && row.some((cell, idx) => cell !== 0 && idx > 1))
        ) {
          movePossible = true;

          return true;
        }
      });
      break;

    case 'Right':
      break;
  }

  return availablePositions.length !== 0 && movePossible;
}

function moveTiles(direction) {
  switch (direction) {
    case 'Up':
      break;
    case 'Down':
      break;
    case 'Left':
      tiles.forEach((row, idx) => {
        // move zeros to the end
      });
      break;
    case 'Right':
      break;
  }
}

function generateNewCell() {
  const position = Math.floor(Math.random() * availablePositions.length);
  const value = Math.random() < 0.9 ? 2 : 4;

  // console.log('Pos = ', position);
  // console.log('Pos = ', availablePositions[position]);

  return {
    row: availablePositions[position].row,
    col: availablePositions[position].col,
    value,
  };
}

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
