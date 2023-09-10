'use strict';

const gameField = document.querySelector('tbody');
const gameScore = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const cellsInRow = 4;
let scoreCount = 0;
let field;

function startGame() {
  field = Array.from({ length: cellsInRow }, () => Array(cellsInRow).fill(0));
  scoreCount = 0;
  gameScore.innerText = scoreCount;
  placeTile();
  placeTile();
}

function placeTile() {
  if (!hasEmptyCells()) {
    return;
  }

  let randomRow, randomColumn;

  do {
    randomRow = Math.floor(Math.random() * cellsInRow);
    randomColumn = Math.floor(Math.random() * cellsInRow);
  } while (field[randomRow][randomColumn] !== 0);
  field[randomRow][randomColumn] = Math.random() < 0.8 ? 2 : 4;
  setCells();
}

function hasEmptyCells() {
  return field.some(row => row.includes(0));
}

function removeEmptyCells(row) {
  return row.filter(num => num !== 0);
}

function setCells() {
  for (let i = 0; i < cellsInRow; i++) {
    for (let j = 0; j < cellsInRow; j++) {
      const currentCell = gameField.rows[i].cells[j];
      const num = field[i][j];

      currentCell.innerText = '';
      currentCell.classList.value = '';
      currentCell.classList.add('field-cell');

      if (num > 0) {
        currentCell.innerText = num;
        currentCell.classList.add(`field-cell--${num}`);
      }

      if (num === 2048) {
        messageWin.classList.remove('hidden');
        button.classList.replace('restart', 'start');
      }
    }
  }

  if (gameIsLost()) {
    messageLose.classList.remove('hidden');
  }
}

function gameIsLost() {
  if (hasEmptyCells()) {
    return false;
  }

  for (let i = 0; i < cellsInRow; i++) {
    for (let j = 0; j < cellsInRow; j++) {
      if (field[i][j] === field[i][j + 1]) {
        return false;
      }
    }
  }

  for (let i = 0; i < cellsInRow - 1; i++) {
    for (let j = 0; j < cellsInRow; j++) {
      if (field[i][j] === field[i + 1][j]) {
        return false;
      }
    }
  }

  return true;
}

function slide(row) {
  const emptyCell = hasEmptyCells();
  let merge = false;

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      merge = true;
      break;
    }
  }

  if (!emptyCell && !merge) {
    return row;
  }

  let newRow = removeEmptyCells(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      scoreCount += newRow[i];
      gameScore.innerText = scoreCount;
    }
  }
  newRow = removeEmptyCells(newRow);

  while (newRow.length < cellsInRow) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  for (let i = 0; i < cellsInRow; i++) {
    let row = field[i];

    row = slide(row);
    field[i] = row;
  }
}

function slideRight() {
  for (let i = 0; i < cellsInRow; i++) {
    let row = field[i].reverse();

    row = slide(row).reverse();
    field[i] = row;
  }
}

function slideUp() {
  for (let i = 0; i < cellsInRow; i++) {
    let col = [field[0][i], field[1][i], field[2][i], field[3][i]];

    col = slide(col);

    for (let j = 0; j < cellsInRow; j++) {
      field[j][i] = col[j];
    }
  }
}

function slideDown() {
  for (let i = 0; i < cellsInRow; i++) {
    let col = [field[0][i], field[1][i], field[2][i], field[3][i]].reverse();

    col = slide(col).reverse();

    for (let j = 0; j < cellsInRow; j++) {
      field[j][i] = col[j];
    }
  }
}

button.addEventListener('click', () => {
  button.classList.replace('start', 'restart');
  button.innerText = 'Restart';
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  startGame();
});

document.addEventListener('keyup', (e) => {
  e.preventDefault();

  const previousField = JSON.stringify(field);

  switch (e.code) {
    case 'ArrowLeft':
      slideLeft();

      if (JSON.stringify(field) !== previousField) {
        placeTile();
      }
      break;
    case 'ArrowRight':
      slideRight();

      if (JSON.stringify(field) !== previousField) {
        placeTile();
      }
      break;
    case 'ArrowUp':
      slideUp();

      if (JSON.stringify(field) !== previousField) {
        placeTile();
      }
      break;
    case 'ArrowDown':
      slideDown();

      if (JSON.stringify(field) !== previousField) {
        placeTile();
      }
      break;

    default:
      break;
  }
  setCells();
});
