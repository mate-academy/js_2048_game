'use strict';

const BUTTON_START = document.querySelector('.start');
const MESSAGE_START = document.querySelector('.message-start');
const MESSAGE_LOSE = document.querySelector('.message-lose');
const MESSAGE_WIN = document.querySelector('.message-win');
const GAME_SCORE = document.querySelector('.game-score');
const GAME_FIELD = document.querySelector('tbody');

let SCORE = 0;

const INTERNAL_FIELD = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const [ ROWS, COLUMNS ] = [ 4, 4 ];

BUTTON_START.addEventListener('click', () => {
  BUTTON_START.classList.remove('start');
  BUTTON_START.classList.add('restart');
  BUTTON_START.textContent = 'Restart';
  MESSAGE_START.classList.add('hidden');
  MESSAGE_LOSE.classList.add('hidden');
  MESSAGE_WIN.classList.add('hidden');
  SCORE = 0;
  GAME_SCORE.textContent = SCORE;

  resetField(INTERNAL_FIELD);

  setRandomCellValue();
  setRandomCellValue();
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
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
  }

  GAME_SCORE.textContent = SCORE;

  setMessageLose();
  setMessageWin();
  setRandomCellValue();
});

function setRandomCellValue() {
  if (!hasEmptyCell()) {
    return;
  }

  const r = Math.floor(Math.random() * ROWS);
  const c = Math.floor(Math.random() * COLUMNS);

  if (INTERNAL_FIELD[r][c] === 0) {
    INTERNAL_FIELD[r][c] = (Math.random() >= 0.9) ? 4 : 2;
    renderGameField();
  } else {
    setRandomCellValue();
  }
}

function hasEmptyCell() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      if (INTERNAL_FIELD[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function renderGameField() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      const cell = GAME_FIELD.children[r].children[c];
      const num = INTERNAL_FIELD[r][c];

      cell.textContent = '';
      cell.classList.value = '';
      cell.classList.add('field-cell');

      if (num > 0) {
        cell.classList.add(`field-cell--${num}`);
        cell.textContent = num;
      }
    }
  }
}

function setMessageWin() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      if (INTERNAL_FIELD[r][c] === 2048) {
        MESSAGE_WIN.classList.remove('hidden');
      }
    }
  }
}

function setMessageLose() {
  if (hasEmptyCell()) {
    return;
  }

  for (let r = 0; r < ROWS - 1; r++) {
    for (let c = 0; c < COLUMNS - 1; c++) {
      if (INTERNAL_FIELD[r][c] === INTERNAL_FIELD[r][c + 1]
        || INTERNAL_FIELD[r][c] === INTERNAL_FIELD[r + 1][c]) {
        return;
      }
    }
  }

  MESSAGE_LOSE.classList.remove('hidden');
}

function resetField(field) {
  return field.forEach(e => e.splice(0, COLUMNS, 0, 0, 0, 0));
}

function slide(row) {
  let filteredRow = row.filter(el => el !== 0);

  for (let i = 0; i < filteredRow.length - 1; i++) {
    if (filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      filteredRow[i + 1] = 0;
      SCORE += filteredRow[i];
    }
  }

  filteredRow = filteredRow.filter(el => el !== 0);

  while (filteredRow.length < ROWS) {
    filteredRow.push(0);
  }

  return filteredRow;
}

function slideLeft() {
  for (let r = 0; r < ROWS; r++) {
    const row = INTERNAL_FIELD[r];

    const filteredRow = slide(row);

    INTERNAL_FIELD[r] = filteredRow;

    renderGameField();
  }
}

function slideRight() {
  for (let r = 0; r < ROWS; r++) {
    const row = INTERNAL_FIELD[r];

    const reversedRow = slide([...row].reverse());

    INTERNAL_FIELD[r] = reversedRow.reverse();

    renderGameField();
  }
}

function slideUp() {
  for (let c = 0; c < COLUMNS; c++) {
    const row = [INTERNAL_FIELD[0][c],
      INTERNAL_FIELD[1][c],
      INTERNAL_FIELD[2][c],
      INTERNAL_FIELD[3][c]];

    const filteredRow = slide(row);

    INTERNAL_FIELD[0][c] = filteredRow[0];
    INTERNAL_FIELD[1][c] = filteredRow[1];
    INTERNAL_FIELD[2][c] = filteredRow[2];
    INTERNAL_FIELD[3][c] = filteredRow[3];

    renderGameField();
  }
}

function slideDown() {
  for (let c = 0; c < COLUMNS; c++) {
    const row = [INTERNAL_FIELD[0][c],
      INTERNAL_FIELD[1][c],
      INTERNAL_FIELD[2][c],
      INTERNAL_FIELD[3][c]];

    const reversedRow = slide([...row].reverse());

    reversedRow.reverse();

    INTERNAL_FIELD[0][c] = reversedRow[0];
    INTERNAL_FIELD[1][c] = reversedRow[1];
    INTERNAL_FIELD[2][c] = reversedRow[2];
    INTERNAL_FIELD[3][c] = reversedRow[3];

    renderGameField();
  }
}
