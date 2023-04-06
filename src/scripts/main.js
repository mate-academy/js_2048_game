'use strict';

const startButton = document.querySelector('.start');
const scoreDisplay = document.querySelector('.game-score');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');
const cells = document.querySelectorAll('.field-cell');

const cellsData = [];
let isGameOver = false;
let score = 0;

// Create an array for each cell
for (let i = 0; i < 16; i++) {
  cellsData.push({ value: 0 });
}

// Add a new number to the playing field
function addNewNumber() {
  // Get all free cells
  const emptyCells = cellsData.filter((cell) => cell.value === 0);

  if (emptyCells.length > 0) {
    // Select a random free cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    // const randomCell1 = emptyCells[randomIndex + 1];
    // const randomCell2 = emptyCells[randomIndex + 2];

    // randomCell1.value = 1024;
    // randomCell2.value = 1024;
    // Set value to 2 or 4
    randomCell.value = Math.random() < 0.9 ? 2 : 4;

    scoreDisplay.textContent = score;
    // Update cell data on the page

    updateCells();
  }
}

function updateCells() {
  cells.forEach((cell, index) => {
    const cellValue = cellsData[index].value;

    if (cellValue !== 0) {
      cell.textContent = cellValue;

      cell.classList.remove(
        'field-cell--2',
        'field-cell--4',
        'field-cell--8',
        'field-cell--16',
        'field-cell--32',
        'field-cell--64',
        'field-cell--128',
        'field-cell--256',
        'field-cell--512',
        'field-cell--1024',
        'field-cell--2048'
      );
      cell.classList.add(`field-cell--${cellValue}`);
    } else {
      cell.textContent = '';

      cell.classList.remove(
        'field-cell--2',
        'field-cell--4',
        'field-cell--8',
        'field-cell--16',
        'field-cell--32',
        'field-cell--64',
        'field-cell--128',
        'field-cell--256',
        'field-cell--512',
        'field-cell--1024',
        'field-cell--2048'
      );
    }
  });
}

startButton.addEventListener('click', () => {
  resetGame();
  addNewNumber();
  startButton.textContent = 'Restart';
  startButton.classList.add('restart');
  startMessage.classList.add('hidden');
});

function resetGame() {
  score = 0;

  // Reset all cell values to 0
  cellsData.forEach((cell) => {
    cell.value = 0;
  });

  isGameOver = false;

  // Clear score display and messages
  scoreDisplay.textContent = '0';
  loseMessage.classList.remove('show');
  winMessage.classList.remove('show');

  // Remove cell classes
  cells.forEach((cell) => {
    cell.textContent = '';

    cell.classList.remove(
      'field-cell--2',
      'field-cell--4',
      'field-cell--8',
      'field-cell--16',
      'field-cell--32',
      'field-cell--64',
      'field-cell--128',
      'field-cell--256',
      'field-cell--512',
      'field-cell--1024',
      'field-cell--2048'
    );
  });

  addNewNumber();
}

function checkWin() {
  for (let row = 0; row < cellsData.length; row++) {
    if (cellsData[row].value === 2048) {
      return true;
    }
  }

  return false;
}

function checkGameOver() {
  // create emtyCell array where we have only emty cell
  const emptyCells = cellsData.filter(cell => cell.value === 0);

  if (emptyCells.length === 0) {
    // Check if there are any adjacent cells with the same value
    for (let i = 0; i < cellsData.length; i++) {
      const cell = cellsData[i];

      // current cell is not most right cell
      //  and neighboring cells are not equal to each other
      if (i % 4 !== 3 && cell.value === cellsData[i + 1].value) {
        return false;
      }

      // the cell is in the first three rows of the playing field
      if (i < 12 && cell.value === cellsData[i + 4].value) {
        return false;
      }
    }

    return true;
  }

  return false;
}

document.addEventListener('keydown', (eventKey) => {
  if (!isGameOver) {
    if (eventKey.key === 'ArrowLeft') {
      moveCellsLeft();
    } else if (eventKey.key === 'ArrowUp') {
      moveCellsUp();
    } else if (eventKey.key === 'ArrowRight') {
      moveCellsRight();
    } else if (eventKey.key === 'ArrowDown') {
      moveCellsDown();
    }
  }
});

function mergeCells(row) {
  const arr = row.filter(num => num); // removing empty cells

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[i + 1]) { // merge cells with the same values
      arr[i] *= 2;
      score += arr[i];
      arr.splice(i + 1, 1);
    }
  }

  // adding missing empty cells to align the row
  while (arr.length < 4) {
    arr.push(0);
  }

  // scoreDisplay.textContent = score;
  return arr;
}

function moveCellsLeft() {
  let hasChanged = false;

  for (let i = 0; i < 4; i++) {
    const row = [];

    for (let j = 0; j < 4; j++) {
      row.push(cellsData[i * 4 + j].value);
    }

    const merged = mergeCells(row);

    for (let j = 0; j < 4; j++) {
      cellsData[i * 4 + j].value = merged[j];
    }

    if (!hasChanged && merged.join() !== row.join()) {
      hasChanged = true;
    }
  }

  if (hasChanged) {
    updateData();
  }
}

function moveCellsRight() {
  let hasChanged = false;

  for (let i = 0; i < 4; i++) {
    const row = [];

    for (let j = 3; j >= 0; j--) {
      row.push(cellsData[i * 4 + j].value);
    }

    const merged = mergeCells(row);

    for (let j = 3; j >= 0; j--) {
      cellsData[i * 4 + j].value = merged[3 - j];
    }

    if (!hasChanged && merged.join() !== row.join()) {
      hasChanged = true;
    }
  }

  if (hasChanged) {
    updateData();
  }
}

function moveCellsUp() {
  let hasChanged = false;

  for (let j = 0; j < 4; j++) {
    const column = [];

    for (let i = 0; i < 4; i++) {
      column.push(cellsData[i * 4 + j].value);
    }

    const merged = mergeCells(column);

    for (let i = 0; i < 4; i++) {
      cellsData[i * 4 + j].value = merged[i];
    }

    if (!hasChanged && merged.join() !== column.join()) {
      hasChanged = true;
    }
  }

  if (hasChanged) {
    updateData();
  }
}

function updateData() {
  addNewNumber();
  updateCells();
  updateScore();

  if (checkGameOver()) {
    gameOver(false);
  }

  if (checkWin()) {
    gameOver(true);
  }
}

function moveCellsDown() {
  let hasChanged = false;

  for (let j = 0; j < 4; j++) {
    const column = [];

    for (let i = 3; i >= 0; i--) {
      column.push(cellsData[i * 4 + j].value);
    }

    const merged = mergeCells(column);

    for (let i = 3; i >= 0; i--) {
      cellsData[i * 4 + j].value = merged[3 - i];
    }

    if (!hasChanged && merged.join() !== column.join()) {
      hasChanged = true;
    }
  }

  if (hasChanged) {
    updateData();
  }
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function gameOver(isWin) {
  if (isWin) {
    winMessage.classList.add('show');
  } else {
    isGameOver = true;
    loseMessage.classList.add('show');
  }
}
