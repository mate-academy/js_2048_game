'use strict';

// <---------- getting elements ----------> \\
const container = document.querySelector('.container');
const gameField = container.querySelector('.game-field');
const header = container.querySelector('.controls');
const startButton = header.querySelector('.start');
const startMessage = container.querySelector('.message-start');
const loseMessage = container.querySelector('.message-lose');
const winMessage = container.querySelector('.message-win');
const score = header.querySelector('.game-score');

// <---------- creating a field for the game ----------> \\
const field = [[], [], [], []];
const size = 4;

function createField(fieldSize) {
  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < 4; j++) {
      field[i][j] = 0;
    }
  }
}

// <---------- add an event to the start button ----------> \\
startButton.addEventListener('click', () => {
  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');

  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';

  createField(size);
  generateRandomNumber();
  generateRandomNumber();
  renderField();

  window.addEventListener('keydown', makeMove);
});

// <---------- render of the field for the game ----------> \\
function renderField() {
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const fieldCell = gameField.rows[row].cells[column];

      fieldCell.classList = ['field-cell'];

      if (field[row][column] > 0) {
        fieldCell.classList.add(`field-cell--${field[row][column]}`);
        fieldCell.textContent = `${field[row][column]}`;
      } else {
        fieldCell.textContent = '';
      }

      if (field[row][column] === 2048) {
        winMessage.classList.remove('hidden');
      }
    }
  }
}

// <---------- generate random number for a random free cell ----------> \\
function generateRandomNumber() {
  const freeCells = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (field[i][j] === 0) {
        freeCells.push([i, j]);
      }
    }
  }

  const [row, column] = freeCells[Math.floor(Math.random() * freeCells.length)];

  field[row][column] = Math.random() <= 0.1 ? 4 : 2;
}

// <---------- function for 'keydown' event to make motion ---------> \\
function makeMove(e) {
  e.preventDefault();

  if (!canMoveDown() && !canMoveLeft() && !canMoveRight() && !canMoveUp()) {
    loseMessage.classList.remove('hidden');
  }

  switch (e.keyCode) {
    case 38:
      if (canMoveUp()) {
        moveUp();
        mergeUp();
        generateRandomNumber();
        renderField();
      }
      break;
    case 40:
      if (canMoveDown()) {
        moveDown();
        mergeDown();
        generateRandomNumber();
        renderField();
      }
      break;
    case 37:
      if (canMoveLeft()) {
        moveLeft();
        mergeLeft();
        generateRandomNumber();
        renderField();
      }
      break;
    case 39:
      if (canMoveRight()) {
        moveRight();
        mergeRight();
        generateRandomNumber();
        renderField();
      }
      break;
  }
}

// <---------- movement of elements and their merging up ----------> \\
function moveUp() {
  for (let column = 0; column < size; column++) {
    let hasMoved = false;

    for (let row = 1; row < size; row++) {
      hasMoved = moveCell(row - 1, row, column, column) || hasMoved;
    }

    if (hasMoved) {
      return moveUp();
    }
  }
}

function mergeUp() {
  for (let column = 0; column < size; column++) {
    for (let row = 1; row < size; row++) {
      mergeSameCell(row - 1, row, column, column);
      moveUp();
    }
  }
}

function canMoveUp() {
  let can = false;

  for (let column = 0; column < size; column++) {
    for (let row = 1; row < size; row++) {
      can = canMakeMove(row - 1, row, column, column) || can;
    }
  }

  return can;
}

// <---------- movement of elements and their merging down ----------> \\
function moveDown() {
  for (let column = 0; column < size; column++) {
    let hasMoved = false;

    for (let row = size - 1; row >= 1; row--) {
      hasMoved = moveCell(row, row - 1, column, column) || hasMoved;
    }

    if (hasMoved) {
      return moveDown();
    }
  }
}

function mergeDown() {
  for (let column = 0; column < size; column++) {
    for (let row = size - 1; row >= 1; row--) {
      mergeSameCell(row, row - 1, column, column);
      moveDown();
    }
  }
}

function canMoveDown() {
  let can = false;

  for (let column = 0; column < size; column++) {
    for (let row = size - 1; row >= 1; row--) {
      can = canMakeMove(row, row - 1, column, column) || can;
    }
  }

  return can;
}

// <---------- movement of elements and their merging left ----------> \\
function moveLeft() {
  for (let row = 0; row < size; row++) {
    let hasMoved = false;

    for (let column = 1; column < size; column++) {
      hasMoved = moveCell(row, row, column - 1, column) || hasMoved;
    }

    if (hasMoved) {
      return moveLeft();
    }
  }
}

function mergeLeft() {
  for (let row = 0; row < size; row++) {
    for (let column = 1; column < size; column++) {
      mergeSameCell(row, row, column - 1, column);
      moveLeft();
    }
  }
}

function canMoveLeft() {
  let can = false;

  for (let row = 0; row < size; row++) {
    for (let column = 1; column < size; column++) {
      can = canMakeMove(row, row, column - 1, column) || can;
    }
  }

  return can;
}

// <---------- movement of elements and their merging right ----------> \\
function moveRight() {
  for (let row = 0; row < size; row++) {
    let hasMoved = false;

    for (let column = size - 1; column >= 1; column--) {
      hasMoved = moveCell(row, row, column, column - 1) || hasMoved;
    }

    if (hasMoved) {
      return moveRight();
    }
  }
}

function mergeRight() {
  for (let row = 0; row < size; row++) {
    for (let column = size - 1; column >= 1; column--) {
      mergeSameCell(row, row, column, column - 1);
      moveRight();
    }
  }
}

function canMoveRight() {
  let can = false;

  for (let row = 0; row < size; row++) {
    for (let column = size - 1; column >= 1; column--) {
      can = canMakeMove(row, row, column, column - 1) || can;
    }
  }

  return can;
}

// <---------- helper function for making movement ----------> \\
function moveCell(currentRow, nextRow, currentColumn, nextColumn) {
  let checkMove = false;

  if (field[currentRow][currentColumn] === 0
    && field[nextRow][nextColumn] > 0) {
    field[currentRow][currentColumn] = field[nextRow][nextColumn];
    field[nextRow][nextColumn] = 0;

    checkMove = true;
  }

  return checkMove;
}

// <---------- merge cell helper function ----------> \\
function mergeSameCell(currentRow, nextRow, currentColumn, nextColumn) {
  if (field[currentRow][currentColumn] === field[nextRow][nextColumn]
    && field[nextRow][nextColumn] > 0) {
    field[currentRow][currentColumn] += field[nextRow][nextColumn];
    field[nextRow][nextColumn] = 0;

    score.textContent = +score.textContent + field[currentRow][currentColumn];
  }
}

// <---------- helper function for checking available movements ----------> \\
function canMakeMove(currentRow, nextRow, currentColumn, nextColumn) {
  if (field[nextRow][nextColumn] > 0
    && (field[nextRow][nextColumn] === field[currentRow][currentColumn]
    || field[currentRow][currentColumn] === 0)) {
    return true;
  }
}
