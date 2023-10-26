'use strict';

const startBtn = document.querySelector('.start');
const score = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const CELLS_IN_ROW = 4;
let scoreCount;
let field;

startBtn.addEventListener('click', startGame);

function startGame() {
  scoreCount = 0;

  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
  startBtn.innerHTML = 'Restart';
  score.innerHTML = scoreCount;

  createCell();
  createCell();
}

function createCell() {
  while (hasEmptyTile()) {
    const randomRow = Math.floor((Math.random() * CELLS_IN_ROW));
    const randomCol = Math.floor((Math.random() * CELLS_IN_ROW));

    if (field[randomRow][randomCol] === 0) {
      const numb = Math.random() < 0.9 ? 2 : 4;

      field[randomRow][randomCol] = numb;
      break;
    }
  }

  renderCells();
}

function hasEmptyTile() {
  for (let i = 0; i < CELLS_IN_ROW; i++) {
    if (field[i].includes(0)) {
      return true;
    }
  }

  return false;
}

function renderCells() {
  for (let r = 0; r < CELLS_IN_ROW; r++) {
    for (let c = 0; c < CELLS_IN_ROW; c++) {
      const currentCell = gameField.rows[r].cells[c];
      const num = field[r][c];

      currentCell.innerText = '';
      currentCell.classList.value = '';
      currentCell.classList.add('field-cell');

      if (num > 0) {
        currentCell.innerText = num;
        currentCell.classList.add(`field-cell--${num}`);
      }

      if (num === 2048) {
        messageWin.classList.remove('hidden');
        startBtn.classList.replace('restart', 'start');
      }
    }
  }

  if (loseTheGame()) {
    messageLose.classList.remove('hidden');
  }
}

function loseTheGame() {
  if (hasEmptyTile()) {
    return false;
  }

  for (let r = 0; r < CELLS_IN_ROW; r++) {
    for (let c = 0; c < CELLS_IN_ROW; c++) {
      if (field[r][c] === field[r][c + 1]) {
        return false;
      }
    }
  }

  for (let r = 0; r < CELLS_IN_ROW - 1; r++) {
    for (let c = 0; c < CELLS_IN_ROW; c++) {
      if (field[r][c] === field[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

function removeEmptyTiles(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let newRow = removeEmptyTiles(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      scoreCount += newRow[i];

      score.innerText = scoreCount;
    }
  }

  newRow = removeEmptyTiles(newRow);

  while (newRow.length < CELLS_IN_ROW) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  for (let r = 0; r < CELLS_IN_ROW; r++) {
    let row = field[r];

    row = slide(row);
    field[r] = row;
  }
}

function slideRight() {
  for (let r = 0; r < CELLS_IN_ROW; r++) {
    let row = field[r].reverse();

    row = slide(row).reverse();
    field[r] = row;
  }
}

function slideUp() {
  for (let c = 0; c < CELLS_IN_ROW; c++) {
    let column = [field[0][c], field[1][c], field[2][c], field[3][c]];

    column = slide(column);

    for (let r = 0; r < CELLS_IN_ROW; r++) {
      field[r][c] = column[r];
    }
  }
}

function slideDown() {
  for (let c = 0; c < CELLS_IN_ROW; c++) {
    let column = [field[0][c], field[1][c], field[2][c], field[3][c]].reverse();

    column = slide(column).reverse();

    for (let r = 0; r < CELLS_IN_ROW; r++) {
      field[r][c] = column[r];
    }
  }
}

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  switch (e.code) {
    case 'ArrowLeft':
      if (canSlideLeft()) {
        slideLeft();
        createCell();
      }
      break;

    case 'ArrowRight':
      if (canSlideRight()) {
        slideRight();
        createCell();
      }
      break;

    case 'ArrowUp':
      if (canSlideUp()) {
        slideUp();
        createCell();
      }
      break;

    case 'ArrowDown':
      if (canSlideDown()) {
        slideDown();
        createCell();
      }
      break;
  }

  renderCells();
});

function canSlideLeft() {
  for (let r = 0; r < CELLS_IN_ROW; r++) {
    for (let c = 1; c < CELLS_IN_ROW; c++) {
      if (field[r][c] !== 0 && (field[r][c - 1] === 0
          || field[r][c - 1] === field[r][c])) {
        return true;
      }
    }
  }

  return false;
}

function canSlideRight() {
  for (let r = 0; r < CELLS_IN_ROW; r++) {
    for (let c = CELLS_IN_ROW - 2; c >= 0; c--) {
      if (field[r][c] !== 0 && (field[r][c + 1]
          === 0 || field[r][c + 1] === field[r][c])) {
        return true;
      }
    }
  }

  return false;
}

function canSlideUp() {
  for (let c = 0; c < CELLS_IN_ROW; c++) {
    for (let r = 1; r < CELLS_IN_ROW; r++) {
      if (field[r][c] !== 0 && (field[r - 1][c]
          === 0 || field[r - 1][c] === field[r][c])) {
        return true;
      }
    }
  }

  return false;
}

function canSlideDown() {
  for (let c = 0; c < CELLS_IN_ROW; c++) {
    for (let r = CELLS_IN_ROW - 2; r >= 0; r--) {
      if (field[r][c] !== 0 && (field[r + 1][c]
          === 0 || field[r + 1][c] === field[r][c])) {
        return true;
      }
    }
  }

  return false;
}
