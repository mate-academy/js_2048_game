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
const gameFieldTable = document.querySelector('.game-field');
const gameField = document.querySelector('.game-field').tBodies[0];

const gameScore = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const winValue = 2048;
let maxTileValue = 0;
let score = 0;
let isListenerRemoved = false;
let touchX = 0;
let touchY = 0;

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

function getColumn(columnNum) {
  return field.reduce((accum, row) => {
    accum.push(row[columnNum]);

    return accum;
  }, []);
}

function updateColumn(columnNum, newColumn) {
  for (let r = 0; r < rowsNum; r++) {
    field[r][columnNum] = newColumn[r];

    updateTile(r, columnNum, newColumn[r] || '');
  }
}

function updateRow(rowNum, newRow) {
  field[rowNum] = newRow;

  for (let c = 0; c < columnsNum; c++) {
    updateTile(rowNum, c, newRow[c] || '');
  }
}

function slideUp() {
  for (let c = 0; c < columnsNum; c++) {
    const newColumn = slide(getColumn(c));

    updateColumn(c, newColumn);
  }
}

function slideDown() {
  for (let c = 0; c < columnsNum; c++) {
    const newColumn = slide(getColumn(c).reverse()).reverse();

    updateColumn(c, newColumn);
  }
}

function slideLeft() {
  for (let r = 0; r < rowsNum; r++) {
    const newRow = slide(field[r]);

    updateRow(r, newRow);
  }
}

function slideRight() {
  for (let r = 0; r < rowsNum; r++) {
    const newRow = slide(field[r].reverse()).reverse();

    updateRow(r, newRow);
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
    const column = getColumn(c);

    if (slide(column, true).some((tileValue) => tileValue === 0)) {
      return true;
    }
  }

  return false;
}

function removeListeners() {
  document.removeEventListener('keyup', handleSlide);
  gameFieldTable.removeEventListener('touchstart', handleFirstTouch);
  gameFieldTable.removeEventListener('touchend', handleSlideWithSwipe);
}

function changeFieldAfterSlide() {
  gameScore.textContent = score;

  if (maxTileValue === winValue) {
    messageWin.classList.remove('hidden');

    removeListeners();

    isListenerRemoved = true;

    return;
  }

  addTile();

  if (!canMoveHorizontally() && !canMoveVertically()) {
    messageLose.classList.remove('hidden');

    removeListeners();

    isListenerRemoved = true;
  }
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

  changeFieldAfterSlide();
}

function handleFirstTouch(e) {
  e.preventDefault();

  touchX = e.changedTouches[0].clientX;
  touchY = e.changedTouches[0].clientY;
}

function handleSlideWithSwipe(e) {
  const deltaX = e.changedTouches[0].clientX - touchX;
  const deltaY = e.changedTouches[0].clientY - touchY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX < 0) {
      slideLeft();
    } else {
      slideRight();
    }
  } else if (Math.abs(deltaX) < Math.abs(deltaY)) {
    if (deltaY < 0) {
      slideUp();
    } else {
      slideDown();
    }
  } else {
    return;
  }

  changeFieldAfterSlide();
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
      removeListeners();
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
  gameFieldTable.addEventListener('touchstart', handleFirstTouch);
  gameFieldTable.addEventListener('touchend', handleSlideWithSwipe);
});
