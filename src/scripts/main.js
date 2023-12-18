'use strict';

let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;
const cellsLength = 4;
const WINNING_SCORE = 2048;

const button = document.querySelector('.button');
const fieldCells = document.querySelectorAll('.field-cell');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerHTML = 'Restart';
    messageStart.classList.add('hidden');

    disableScroll();
    generateRandomCell();
    generateRandomCell();
    updateFieldCell();
  } else if (button.classList.contains('restart')) {
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    gameField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    score = 0;

    disableScroll();
    generateRandomCell();
    generateRandomCell();
    updateFieldCell();
  }
});

function generateRandomCell() {
  const emptyCells = [];

  for (let row = 0; row < cellsLength; row++) {
    for (let col = 0; col < cellsLength; col++) {
      if (!gameField[row][col]) {
        emptyCells.push({
          row, col,
        });
      }
    }
  }

  if (emptyCells.length > 0) {
    const { row, col }
      = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    gameField[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}

function updateFieldCell() {
  for (let row = 0; row < cellsLength; row++) {
    for (let col = 0; col < cellsLength; col++) {
      const cellValue = gameField[row][col];
      const index = row * cellsLength + col;
      const cellElement = fieldCells[index];

      if (cellValue === 0) {
        cellElement.innerHTML = '';
      } else {
        cellElement.innerHTML = cellValue;
      }

      cellElement.className = `field-cell ${cellValue !== 0
        ? `field-cell--${cellValue}`
        : ''}`;
    }
  }

  gameScore.innerHTML = score;
}

document.addEventListener('keyup', (e) => {
  let moved = false;

  switch (e.code) {
    case 'ArrowRight':
      moved = slideRight();
      break;

    case 'ArrowLeft':
      moved = slideLeft();
      break;

    case 'ArrowUp':
      moved = slideUp();
      break;

    case 'ArrowDown':
      moved = slideDown();
      break;

    default:
      break;
  }

  if (moved) {
    generateRandomCell();
    updateFieldCell();

    if (isGameOver()) {
      messageLose.classList.remove('hidden');
      enableScroll();
    }
  }
});

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function slide(row) {
  let newRow = row;

  newRow = filterZero(newRow);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }

    if (newRow[i] === WINNING_SCORE) {
      messageWin.classList.remove('hidden');
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < cellsLength) {
    newRow.push(0);
  }

  return newRow;
}

function areArraysEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function slideLeft() {
  let moved = false;

  for (let r = 0; r < cellsLength; r++) {
    let row = gameField[r];
    const originalRow = [...row];

    row = slide(row);
    gameField[r] = row;

    if (!moved && !areArraysEqual(originalRow, row)) {
      moved = true;
    }
  }

  return moved;
}

function slideRight() {
  let moved = false;

  for (let r = 0; r < cellsLength; r++) {
    let row = gameField[r];

    const originalRow = [...row];

    row.reverse();
    row = slide(row);

    row.reverse();

    gameField[r] = row;

    if (!moved && !areArraysEqual(originalRow, row)) {
      moved = true;
    }
  }

  return moved;
}

function slideUp() {
  let moved = false;

  for (let col = 0; col < cellsLength; col++) {
    let column = [
      gameField[0][col],
      gameField[1][col],
      gameField[2][col],
      gameField[3][col],
    ];

    const originalColumn = [...column];

    column = slide(column);

    for (let row = 0; row < cellsLength; row++) {
      gameField[row][col] = column[row];
    }

    if (!moved && !areArraysEqual(originalColumn, column)) {
      moved = true;
    }
  }

  return moved;
}

function slideDown() {
  let moved = false;

  for (let col = 0; col < cellsLength; col++) {
    let column = [
      gameField[0][col],
      gameField[1][col],
      gameField[2][col],
      gameField[3][col],
    ];

    const originalColumn = [...column];

    column.reverse();
    column = slide(column);
    column.reverse();

    for (let row = 0; row < cellsLength; row++) {
      gameField[row][col] = column[row];
    }

    if (!moved && !areArraysEqual(originalColumn, column)) {
      moved = true;
    }
  }

  return moved;
}

function isGameOver() {
  for (let row = 0; row < cellsLength; row++) {
    for (let col = 0; col < cellsLength; col++) {
      if (gameField[row][col] === 0) {
        return false;
      }

      if (
        (col < cellsLength - 1 && gameField[row][col]
          === gameField[row][col + 1])
        || (row < cellsLength - 1 && gameField[row][col]
          === gameField[row + 1][col])
      ) {
        return false;
      }
    }
  }

  return true;
}

function disableScroll() {
  document.body.style.overflow = 'hidden';
}

function enableScroll() {
  document.body.style.overflow = 'auto';
}
