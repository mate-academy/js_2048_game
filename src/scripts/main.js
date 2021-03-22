'use strict';

const START_BUTTON = document.querySelector('button');
const MESSAGE_START = document.querySelector('.message-start');
const MESSAGE_LOSE = document.querySelector('.message-lose');
const MESSAGE_WIN = document.querySelector('.message-win');
const SCORE_CELL = document.querySelector('.game-score');
let IS_MOVES_AVAILABLE = true;
let IS_MOVE_MADE = true;
let SCORE_CURRENT = 0;
const GAME_FIELD = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function renderField() {
  const cells = document.querySelectorAll('td');
  const array = GAME_FIELD.flat();

  for (let i = 0; i < 16; i++) {
    cells[i].innerText = !array[i] ? '' : array[i];
    cells[i].className = '';
    cells[i].classList.add('field-cell', `field-cell--${array[i]}`);
  }
}

function renderScore() {
  SCORE_CELL.innerText = SCORE_CURRENT;
}

function checkWin() {
  const fieldCells = GAME_FIELD.flat();

  for (const cell of fieldCells) {
    if (cell === 2048) {
      MESSAGE_WIN.classList.remove('hidden');
      break;
    }
  }
}

function checkMoves() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (GAME_FIELD[i][j] === 0) {
        IS_MOVES_AVAILABLE = true; break;
      } else if (i < 3 && GAME_FIELD[i][j] === GAME_FIELD[i + 1][j]) {
        IS_MOVES_AVAILABLE = true; break;
      } else if (j < 3 && GAME_FIELD[i][j] === GAME_FIELD[i][j + 1]) {
        IS_MOVES_AVAILABLE = true; break;
      } else {
        IS_MOVES_AVAILABLE = false;
      }
    }

    if (IS_MOVES_AVAILABLE) {
      break;
    }
  }

  if (!IS_MOVES_AVAILABLE) {
    gameOver();
  }
}

function gameOver() {
  MESSAGE_LOSE.classList.remove('hidden');
}

function createNewRandomCell() {
  if (IS_MOVE_MADE) {
    const allEmptyCells = [];

    for (let row = 0; row < GAME_FIELD.length; row++) {
      for (let column = 0; column < GAME_FIELD[row].length; column++) {
        if (!GAME_FIELD[row][column]) {
          allEmptyCells.push([row, column]);
        }
      }
    }

    if (allEmptyCells.length > 0) {
      const randomCell = Math.floor(Math.random() * allEmptyCells.length);
      const [randomRow, randomColumn] = allEmptyCells[randomCell];

      GAME_FIELD[randomRow][randomColumn] = Math.random() > 0.1 ? 2 : 4;
    };

    IS_MOVE_MADE = false;
  }
}

function shiftCells() {
  const prevField = GAME_FIELD.flat().join('');

  for (const row of GAME_FIELD) {
    const tempArr = row.filter(el => el > 0);
    const emptyCells = 4 - tempArr.length;

    for (let i = 0; i < emptyCells; i++) {
      tempArr.unshift(0);
    }

    for (let i = 0; i < tempArr.length; i++) {
      row[i] = tempArr[i];
    }
  }

  const currentField = GAME_FIELD.flat().join('');

  if (prevField !== currentField) {
    IS_MOVE_MADE = true;
  }
}

function addUpCells() {
  for (const row of GAME_FIELD) {
    for (let i = 3; i > 0; i--) {
      if (row[i] === row[i - 1]) {
        SCORE_CURRENT += row[i] * 2;
        row[i] += row[i - 1];
        row[i - 1] = 0;
      }
    }
  }
}

function mergeCells() {
  shiftCells();
  addUpCells();
  shiftCells();
  renderScore();
}

function rotateGameField() {
  const n = GAME_FIELD.length;
  const x = Math.floor(n / 2);
  const y = n - 1;

  for (let row = 0; row < x; row++) {
    for (let column = row; column < y - row; column++) {
      const k = GAME_FIELD[row][column];

      GAME_FIELD[row][column] = GAME_FIELD[y - column][row];
      GAME_FIELD[y - column][row] = GAME_FIELD[y - row][y - column];
      GAME_FIELD[y - row][y - column] = GAME_FIELD[column][y - row];
      GAME_FIELD[column][y - row] = k;
    }
  }
}

function moveRight() {
  mergeCells();
}

function moveLeft() {
  rotateGameField();
  rotateGameField();
  mergeCells();
  rotateGameField();
  rotateGameField();
}

function moveDown() {
  rotateGameField();
  rotateGameField();
  rotateGameField();
  mergeCells();
  rotateGameField();
}

function moveUp() {
  rotateGameField();
  mergeCells();
  rotateGameField();
  rotateGameField();
  rotateGameField();
}

START_BUTTON.addEventListener('click', e => {
  if (START_BUTTON.className === 'button restart') {
    window.location.reload();
  }

  START_BUTTON.className = 'button restart';
  START_BUTTON.innerText = 'Restart';
  MESSAGE_START.classList.add('hidden');
  IS_MOVES_AVAILABLE = true;
  createNewRandomCell();
  renderField();
});

document.addEventListener('keyup', e => {
  e.preventDefault();

  if (!IS_MOVES_AVAILABLE) {
    return;
  };

  switch (e.key) {
    case 'ArrowUp': moveUp(); break;
    case 'ArrowLeft': moveLeft(); break;
    case 'ArrowDown': moveDown(); break;
    case 'ArrowRight': moveRight(); break;
    default: break;
  }

  createNewRandomCell();
  renderField();
  checkWin();
  checkMoves();
});
