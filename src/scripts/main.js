'use strict';

const rowsNum = 4;
const columnsNum = 4;

const field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const startButton = document.querySelector('.button');
const gameField = document.querySelector('.game-field').tBodies[0];

const gameScore = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const winValue = 2048;
let maxTileValue = 0;
let score = 0;
let isListenerRemoved = false;

function filterZero(row) {
  return row.filter(tileValue => tileValue !== 0);
}

function slide(row, isChecking = false) {
  let newRow = filterZero(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;

      if (!isChecking) {
        score += newRow[i];

        maxTileValue = newRow[i] > maxTileValue
          ? newRow[i]
          : maxTileValue;
      }
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < columnsNum) {
    newRow.push(0);
  }

  return newRow;
}

function slideUp() {
  for (let c = 0; c < columnsNum; c++) {
    const row = slide([
      field[0][c],
      field[1][c],
      field[2][c],
      field[3][c],
    ]);

    for (let r = 0; r < rowsNum; r++) {
      field[r][c] = row[r];

      updateTile(r, c, row[r] || '');
    }
  }
}

function slideDown() {
  for (let c = 0; c < columnsNum; c++) {
    const row = slide([
      field[0][c],
      field[1][c],
      field[2][c],
      field[3][c],
    ].reverse()).reverse();

    for (let r = 0; r < rowsNum; r++) {
      field[r][c] = row[r];

      updateTile(r, c, row[r] || '');
    }
  }
}

function slideLeft() {
  for (let r = 0; r < rowsNum; r++) {
    const row = slide(field[r]);

    field[r] = row;

    for (let c = 0; c < columnsNum; c++) {
      updateTile(r, c, row[c] || '');
    }
  }
}

function slideRight() {
  for (let r = 0; r < rowsNum; r++) {
    const row = slide(field[r].reverse()).reverse();

    field[r] = row;

    for (let c = 0; c < columnsNum; c++) {
      updateTile(r, c, row[c] || '');
    }
  }
}

function canMoveHorizontally() {
  for (let r = 0; r < rowsNum; r++) {
    const rowCopy = [...field[r]];

    if (slide(rowCopy, true).some((tileValue) => tileValue === 0)) {
      return true;
    }
  }

  return false;
}

function canMoveVertically() {
  for (let c = 0; c < columnsNum; c++) {
    const column = [
      field[0][c],
      field[1][c],
      field[2][c],
      field[3][c],
    ];

    if (slide(column, true).some((tileValue) => tileValue === 0)) {
      return true;
    }
  }

  return false;
}

function handleSlide(e) {
  const action = e.code;

  switch (action) {
    case 'ArrowUp':
      slideUp();

      break;

    case 'ArrowDown':
      slideDown();

      break;

    case 'ArrowLeft':
      slideLeft();

      break;

    case 'ArrowRight':
      slideRight();

      break;

    default:
      return;
  }

  gameScore.textContent = score;

  if (maxTileValue === winValue) {
    messageWin.classList.remove('hidden');
    document.removeEventListener('keyup', handleSlide);
    isListenerRemoved = true;

    return;
  }

  addTile();

  if (!canMoveHorizontally() && !canMoveVertically()) {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keyup', handleSlide);
    isListenerRemoved = true;
  }
}

function hasEmptyTile() {
  for (const row of field) {
    for (const tile of row) {
      if (tile === 0) {
        return true;
      }
    }
  }

  return false;
}

function updateTile(rowNum, columnNum, newValue) {
  const cell = gameField.rows[rowNum].cells[columnNum];

  cell.classList.remove(`field-cell--${cell.textContent}`);
  cell.textContent = newValue;

  if (newValue) {
    cell.classList.add(`field-cell--${newValue}`);
  }
}

function addTile(isOnlyTwo = false) {
  if (!hasEmptyTile()) {
    return;
  }

  let isAdded = false;

  while (!isAdded) {
    const rowNum = Math.floor(Math.random() * rowsNum);
    const columnNum = Math.floor(Math.random() * columnsNum);

    if (field[rowNum][columnNum] === 0) {
      field[rowNum][columnNum] = isOnlyTwo
        ? 2
        : Math.random() > 0.9 ? 4 : 2;

      updateTile(rowNum, columnNum, field[rowNum][columnNum]);

      isAdded = true;
    }
  }
}

function clearField() {
  maxTileValue = 0;
  score = 0;
  gameScore.textContent = score;

  for (let r = 0; r < rowsNum; r++) {
    for (let c = 0; c < columnsNum; c++) {
      field[r][c] = 0;

      updateTile(r, c, '');
    }
  }
}

startButton.addEventListener('click', (e) => {
  const button = e.target;

  if (button.classList.contains('start')) {
    button.textContent = 'Restart';
    button.classList.replace('start', 'restart');

    messageStart.classList.add('hidden');
  } else if (button.classList.contains('restart')) {
    clearField();

    if (!isListenerRemoved) {
      document.removeEventListener('keyup', handleSlide);
    }

    if (!messageLose.classList.contains('hidden')) {
      messageLose.classList.add('hidden');
    }

    if (!messageWin.classList.contains('hidden')) {
      messageWin.classList.add('hidden');
    }
  }

  addTile(true);
  addTile(true);

  document.addEventListener('keyup', handleSlide);
});
