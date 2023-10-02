'use strict';

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const cellsInRow = 4;
let field;
let score = 0;

button.addEventListener('click', () => {
  button.classList.replace('start', 'restart');
  button.innerText = 'Restart';
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;
  gameScore.textContent = score;
  generateTile();
  generateTile();
});

function generateTile() {
  while (field.flat().includes(0)) {
    const r = Math.floor(Math.random() * cellsInRow);
    const c = Math.floor(Math.random() * cellsInRow);

    if (field[r][c] === 0) {
      const tileValue = Math.random() < 0.8 ? 2 : 4;

      field[r][c] = tileValue;
      break;
    }
  }
  updateField();
}

function updateField() {
  for (let r = 0; r < cellsInRow; r++) {
    for (let c = 0; c < cellsInRow; c++) {
      const currentCell = gameField.rows[r].cells[c];

      currentCell.innerText = '';
      currentCell.classList.value = '';
      currentCell.classList.add('field-cell');

      if (field[r][c] > 0) {
        currentCell.innerText = field[r][c];
        currentCell.classList.add(`field-cell--${field[r][c]}`);
      }

      if (field[r][c] === 2048) {
        messageWin.classList.remove('hidden');
        button.classList.replace('restart', 'start');
      }
    }
  }

  if (loseGame()) {
    messageLose.classList.remove('hidden');
  }
}

function removeEmptyTiles(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  const hasEmptyCells = field.flat().includes(0);
  let canMerge = false;

  for (let r = 0; r < row.length - 1; r++) {
    if (row[r] === row[r + 1]) {
      canMerge = true;
      break;
    }
  }

  if (!hasEmptyCells && !canMerge) {
    return row;
  }

  let newRow = removeEmptyTiles(row);

  for (let r = 0; r < newRow.length - 1; r++) {
    if (newRow[r] === newRow[r + 1]) {
      newRow[r] *= 2;
      newRow[r + 1] = 0;
      score += newRow[r];

      gameScore.innerText = score;
    }
  }

  newRow = removeEmptyTiles(newRow);

  while (newRow.length < cellsInRow) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  for (let r = 0; r < cellsInRow; r++) {
    let row = field[r];

    row = slide(row);
    field[r] = row;
  }
}

function slideRight() {
  for (let r = 0; r < cellsInRow; r++) {
    let row = field[r].reverse();

    row = slide(row).reverse();
    field[r] = row;
  }
}

function slideUp() {
  for (let r = 0; r < cellsInRow; r++) {
    let col = [field[0][r], field[1][r], field[2][r], field[3][r]];

    col = slide(col);

    for (let c = 0; c < cellsInRow; c++) {
      field[c][r] = col[c];
    }
  }
}

function slideDown() {
  for (let r = 0; r < cellsInRow; r++) {
    let col = [field[0][r], field[1][r], field[2][r], field[3][r]].reverse();

    col = slide(col).reverse();

    for (let c = 0; c < cellsInRow; c++) {
      field[c][r] = col[c];
    }
  }
}

function compareFields(a, b) {
  for (let c = 0; c < cellsInRow; c++) {
    for (let r = 0; r < cellsInRow; r++) {
      if (a[c][r] !== b[c][r]) {
        return false;
      }
    }
  }

  return true;
}

document.addEventListener('keyup', (e) => {
  e.preventDefault();

  const pastField = JSON.parse(JSON.stringify(field));

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
  }

  if (!compareFields(pastField, field)) {
    generateTile();
  }

  updateField();
});

function loseGame() {
  if (field.flat().includes(0)) {
    return false;
  }

  for (let r = 0; r < cellsInRow; r++) {
    for (let c = 0; c < cellsInRow; c++) {
      if (field[r][c] === field[r][c + 1]) {
        return false;
      }
    }
  }

  for (let r = 0; r < cellsInRow - 1; r++) {
    for (let c = 0; c < cellsInRow; c++) {
      if (field[r][c] === field[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}
