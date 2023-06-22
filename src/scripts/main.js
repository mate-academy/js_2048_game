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

for (let i = 0; i < 16; i++) {
  cellsData.push({ value: 0 });
}

function addNewNumber() {
  const emptyCells = cellsData.filter((cell) => cell.value === 0);

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    
    randomCell.value = Math.random() < 0.9 ? 2 : 4;

    scoreDisplay.textContent = score;
  
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

  cellsData.forEach((cell) => {
    cell.value = 0;
  });

  isGameOver = false;

  scoreDisplay.textContent = '0';
  loseMessage.classList.remove('show');
  winMessage.classList.remove('show');

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
  return cellsData.some(cell => cell.value === 2048);
}

function checkGameOver() {
  const emptyCells = cellsData.filter(cell => cell.value === 0);

  if (emptyCells.length === 0) {
      for (let i = 0; i < cellsData.length; i++) {
      const cell = cellsData[i];

      if (i % 4 !== 3 && cell.value === cellsData[i + 1].value) {
        return false;
      }

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
  const arr = row.filter(num => num); 
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[i + 1]) { 
      arr[i] *= 2;
      score += arr[i];
      arr.splice(i + 1, 1);
    }
  }

  while (arr.length < 4) {
    arr.push(0);
  }

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
