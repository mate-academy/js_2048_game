'use strict';

const FIELD_SIZE = 4;
let gameField;
let score;

const fieldCells = document.querySelectorAll('td');
const gameScore = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

window.addEventListener('load', () => {
  initializeGame();
});

function initializeGame() {
  gameField = Array(FIELD_SIZE).fill(0)
    .map(row => Array(FIELD_SIZE).fill(0));

  score = 0;

  startButton.addEventListener('click', () => {
    startButton.className = 'button restart';
    startButton.textContent = 'Restart';
    startMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');

    gameField = Array(FIELD_SIZE).fill(0)
      .map(row => Array(FIELD_SIZE).fill(0));
    score = 0;

    for (let i = 0; i < FIELD_SIZE; i++) {
      for (let j = 0; j < FIELD_SIZE; j++) {
        const currentCell = fieldCells[i * FIELD_SIZE + j];

        currentCell.id = (`${i}-${j}`);

        const value = gameField[i][j];

        updateCell(currentCell, value);
      }
    }

    document.addEventListener('keyup', manageGame);

    addRandomCell();
    addRandomCell();
  });
}

function manageGame(e) {
  if (e.code === 'ArrowLeft') {
    slideHorizontal('left');
    addRandomCell();
  } else if (e.code === 'ArrowRight') {
    slideHorizontal('right');
    addRandomCell();
  } else if (e.code === 'ArrowUp') {
    slideVertical('up');
    addRandomCell();
  } else if (e.code === 'ArrowDown') {
    slideVertical('down');
    addRandomCell();
  }

  gameScore.textContent = score;
  hasWon();
  hasLost();
}

function hasWon() {
  const cells = document.querySelectorAll('td');

  for (const cell of cells) {
    if (cell.classList.contains('field-cell--2048')) {
      winMessage.classList.remove('hidden');

      document.removeEventListener('keyup', manageGame);
    }
  }
}

function hasLost() {
  if (
    !canMoveHorizontally('left')
    && !canMoveHorizontally('right')
    && !canMoveVertically('up')
    && !canMoveVertically('down')) {
    loseMessage.classList.remove('hidden');

    document.removeEventListener('keyup', manageGame);
  }
}

function updateCell(cell, value) {
  cell.textContent = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (value > 0) {
    cell.textContent = value;
    cell.classList.add(`field-cell--${value}`);
  }
}

function hasEmptyCell() {
  for (let i = 0; i < FIELD_SIZE; i++) {
    for (let j = 0; j < FIELD_SIZE; j++) {
      if (gameField[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
}

function addRandomCell() {
  if (!hasEmptyCell()) {
    return;
  }

  let isFound = false;

  while (!isFound) {
    const row = Math.floor(Math.random() * FIELD_SIZE);
    const column = Math.floor(Math.random() * FIELD_SIZE);

    if (gameField[row][column] === 0) {
      const randomValue = Math.random() < 0.9 ? 2 : 4;

      gameField[row][column] = randomValue;

      const currentCell = document.getElementById(`${row}-${column}`);

      currentCell.textContent = randomValue;
      currentCell.classList.add(`field-cell--${randomValue}`);
      isFound = true;
    }
  }
}

function slide(row) {
  let currentRow = row.filter(item => item !== 0);

  for (let i = 0; i < currentRow.length - 1; i++) {
    if (currentRow[i] === currentRow[i + 1]) {
      currentRow[i] *= 2;
      currentRow[i + 1] = 0;
      score += currentRow[i];
    }
  }

  currentRow = currentRow.filter(item => item !== 0);

  const oldLength = currentRow.length;

  currentRow.length = FIELD_SIZE;
  currentRow.fill(0, oldLength, FIELD_SIZE);

  return currentRow;
}

function slideHorizontal(direction) {
  for (let i = 0; i < FIELD_SIZE; i++) {
    if (direction === 'right') {
      gameField[i] = slide(gameField[i].reverse()).reverse();
    } else if (direction === 'left') {
      gameField[i] = slide(gameField[i]);
    }

    for (let j = 0; j < FIELD_SIZE; j++) {
      const cell = document.getElementById(`${i}-${j}`);
      const value = gameField[i][j];

      updateCell(cell, value);
    }
  }
}

function slideVertical(direction) {
  for (let j = 0; j < FIELD_SIZE; j++) {
    let row = [
      gameField[0][j],
      gameField[1][j],
      gameField[2][j],
      gameField[3][j],
    ];

    if (direction === 'down') {
      row = slide(row.reverse()).reverse();
    } else if (direction === 'up') {
      row = slide(row);
    }

    for (let i = 0; i < FIELD_SIZE; i++) {
      gameField[i][j] = row[i];

      const cell = document.getElementById(`${i}-${j}`);
      const value = gameField[i][j];

      updateCell(cell, value);
    }
  }
}

function canMoveHorizontally(side) {
  for (let i = 0; i < FIELD_SIZE; i++) {
    const row = gameField[i];

    if (side === 'right') {
      row.reverse();
    }

    for (let j = FIELD_SIZE; j > 0; j--) {
      if (row[j] !== 0 && (row[j - 1] === 0 || row[j] === row[j - 1])) {
        return true;
      }
    }
  }

  return false;
}

function canMoveVertically(side) {
  for (let i = 0; i < FIELD_SIZE; i++) {
    const row = [
      gameField[0][i],
      gameField[1][i],
      gameField[2][i],
      gameField[3][i],
    ];

    if (side === 'down') {
      row.reverse();
    }

    for (let j = FIELD_SIZE - 1; j > 0; j--) {
      if (row[j] !== 0 && (row[j - 1] === 0 || row[j] === row[j - 1])) {
        return true;
      }
    }
  }

  return false;
}
