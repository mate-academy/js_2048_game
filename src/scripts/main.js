'use strict';

const container = document.querySelector('.container');
const controls = container.querySelector('.controls');
const startButton = controls.querySelector('.start');
const gameField = container.querySelector('.game-field');
const messages = container.querySelector('.message-container');
const startMessage = messages.querySelector('.message-start');
const loseMessage = messages.querySelector('.message-lose');
const winMessage = messages.querySelector('.message-win');
const scoreValue = container.querySelector('.game-score');
let totalScore = 0;
let arrField = [];
const WIN_NUMBER = 2048;
const FIELD_SIZE = {
  rows: 4,
  columns: 4,
};
const ARROWS = {
  'up': 'ArrowUp',
  'right': 'ArrowRight',
  'down': 'ArrowDown',
  'left': 'ArrowLeft',
};

// Create array field

function createArrField(arrRows, arrColumns) {
  arrField = new Array(arrRows);

  for (let row = 0; row < arrRows; row++) {
    arrField[row] = new Array(arrColumns);

    for (let column = 0; column < arrColumns; column++) {
      arrField[row][column] = 0;
    }
  }
}

createArrField(FIELD_SIZE.rows, FIELD_SIZE.columns);

// Create restart button

const restartButton = document.createElement('button');

function createRestartButton() {
  restartButton.classList.add('restart', 'button');
  restartButton.textContent = 'Restart';

  return restartButton;
}

// Create two random item

function createTwoNewItem() {
  newRandomCell();
  newRandomCell();
}

// Start game & change start button to restart

startButton.addEventListener('click', event => {
  startButton.remove();
  controls.append(createRestartButton());
  startMessage.classList.add('hidden');
  createTwoNewItem();
  processField(buildGameField);
  addKeysListener();
});

// Restart game & reset game field

restartButton.addEventListener('click', event => {
  loseMessage.classList.add('hidden');
  resetScore();
  createArrField(FIELD_SIZE.rows, FIELD_SIZE.columns);
  createTwoNewItem();
  processField(buildGameField);
  addKeysListener();
});

// Lose message

function endGame(status) {
  if (status === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (status === 'lose') {
    loseMessage.classList.remove('hidden');
  }

  removeKeysListener();
}

// Build game field

function buildGameField(row, column) {
  const fieldCell = gameField.rows[row].cells[column];

  if (arrField[row][column] > 0) {
    fieldCell.classList = ['field-cell'];
    fieldCell.classList.add(`field-cell--${arrField[row][column]}`);
    fieldCell.textContent = `${arrField[row][column]}`;
  } else {
    fieldCell.classList = ['field-cell'];
    fieldCell.textContent = '';
  }
}

// 10% random

function randomValue() {
  if (Math.random() <= 0.1) {
    return 4;
  } else {
    return 2;
  }
}

// Reset score

function resetScore() {
  totalScore = 0;
  scoreValue.textContent = totalScore;
}

// Calculate score

function calculateScore(cellValue) {
  totalScore += cellValue;
  scoreValue.textContent = totalScore;
}

// Random position

function randomPosition() {
  const freeArr = [];

  for (let row = 0; row < arrField.length; row++) {
    for (let column = 0; column < arrField[row].length; column++) {
      if (arrField[row][column] === 0) {
        freeArr.push([row, column]);
      }
    }
  }

  return checkFreeCell(freeArr);
}

// Check free cell

function checkFreeCell(array) {
  if (array.length > 0) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

// New random cell

function newRandomCell() {
  const [ row, column ] = randomPosition();
  const isCellEmpty = arrField[row][column] === 0;

  if (isCellEmpty) {
    arrField[row][column] = randomValue();
  } else {
    return newRandomCell();
  }
}

// Move element

function moveElement(row, column, newRow, newColumn) {
  arrField[newRow][newColumn] = arrField[row][column];
  arrField[row][column] = 0;
}

// Move element and sum

function sumElement(row, column, newRow, newColumn) {
  arrField[newRow][newColumn] *= 2;
  arrField[row][column] = 0;
  calculateScore(arrField[newRow][newColumn]);

  if (arrField[newRow][newColumn] === WIN_NUMBER) {
    endGame('win');
  }
}

// Loop array

function processField(callback) {
  for (let row = 0; row < arrField.length; row++) {
    for (let column = 0; column < arrField[row].length; column++) {
      callback(row, column);
    }
  }
}

// Move elements up

function moveUp() {
  let count = 0;

  for (let row = 0; row < arrField.length - 1; row++) {
    for (let column = 0; column < arrField[row].length; column++) {
      if (arrField[row + 1][column] > 0
        && row + 1 < arrField.length
        && arrField[row][column] === 0) {
        moveElement(row + 1, column, row, column);
        count++;
      }
    }
  }

  if (count > 0) {
    return moveUp();
  }
}

// Sum elements up

function moveUpSum() {
  for (let row = 0; row < arrField.length - 1; row++) {
    for (let column = 0; column < arrField[row].length; column++) {
      if (arrField[row][column] === arrField[row + 1][column]
        && row + 1 < arrField.length) {
        sumElement(row + 1, column, row, column);
      }
    }
  }
}

// Check up

function checkUp() {
  for (let row = 0; row < arrField.length - 1; row++) {
    for (let column = 0; column < arrField[row].length; column++) {
      if (arrField[row + 1][column] > 0
        && (arrField[row][column] === arrField[row + 1][column]
          || arrField[row][column] === 0)) {
        return true;
      }
    }
  }

  return false;
}

// Move elements down

function moveDown() {
  let count = 0;

  for (let row = arrField.length - 1; row > 0; row--) {
    for (let column = 0; column < arrField[row].length; column++) {
      if (arrField[row - 1][column] > 0
        && row - 1 < arrField.length
        && arrField[row][column] === 0) {
        moveElement(row - 1, column, row, column);
        count++;
      }
    }
  }

  if (count > 0) {
    return moveDown();
  }
}

// Sum elements down

function moveDownSum() {
  for (let row = arrField.length - 1; row > 0; row--) {
    for (let column = 0; column < arrField[row].length; column++) {
      if (arrField[row - 1][column] === arrField[row][column]
        && row < arrField.length) {
        sumElement(row - 1, column, row, column);
      }
    }
  }
}

// Check down

function checkDown() {
  for (let row = arrField.length - 1; row > 0; row--) {
    for (let column = 0; column < arrField[row].length; column++) {
      if (arrField[row - 1][column] > 0
        && (arrField[row][column] === arrField[row - 1][column]
          || arrField[row][column] === 0)) {
        return true;
      }
    }
  }

  return false;
}

// Move elements left

function moveLeft() {
  let count = 0;

  for (let row = 0; row < arrField.length; row++) {
    for (let column = 0; column < arrField[row].length - 1; column++) {
      if (arrField[row][column + 1] > 0
        && column + 1 < arrField[row].length
        && arrField[row][column] === 0) {
        moveElement(row, column + 1, row, column);
        count++;
      }
    }
  }

  if (count > 0) {
    return moveLeft();
  }
}

// Sum elements left

function moveLeftSum() {
  for (let row = 0; row < arrField.length; row++) {
    for (let column = 0; column < arrField[row].length - 1; column++) {
      if (arrField[row][column] === arrField[row][column + 1]
        && column + 1 <= arrField[row].length) {
        sumElement(row, column + 1, row, column);
      }
    }
  }
}

// Check Left

function checkLeft() {
  for (let row = 0; row < arrField.length; row++) {
    for (let column = 0; column < arrField[row].length - 1; column++) {
      if (arrField[row][column + 1] > 0
        && (arrField[row][column] === arrField[row][column + 1]
          || arrField[row][column] === 0)) {
        return true;
      }
    }
  }

  return false;
}

// Move elements right

function moveRight() {
  let count = 0;

  for (let row = 0; row < arrField.length; row++) {
    for (let column = arrField[row].length - 1; column > 0; column--) {
      if (arrField[row][column - 1] > 0
        && column - 1 < arrField[row].length
        && arrField[row][column] === 0) {
        moveElement(row, column - 1, row, column);
        count++;
      }
    }
  }

  if (count > 0) {
    return moveRight();
  }
}

// Sum elements right

function moveRightSum() {
  for (let row = 0; row < arrField.length; row++) {
    for (let column = arrField[row].length - 1; column > 0; column--) {
      if (arrField[row][column] === arrField[row][column - 1]
        && column - 1 < arrField[row].length) {
        sumElement(row, column - 1, row, column);
      }
    }
  }
}

// Check right

function checkRight() {
  for (let row = 0; row < arrField.length; row++) {
    for (let column = arrField[row].length - 1; column > 0; column--) {
      if (arrField[row][column - 1] > 0
        && (arrField[row][column] === arrField[row][column - 1]
          || arrField[row][column] === 0)) {
        return true;
      }
    }
  }

  return false;
}

// Check lose

function isLose() {
  if (!(checkUp() || checkDown() || checkLeft() || checkRight())) {
    endGame('lose');
  }
}

// Press key

const arrUp = function(event) {
  if (controls.querySelector('.start') === null) {
    if (event.key === ARROWS.up && checkUp()) {
      moveUp();
      moveUpSum();
      moveUp();
      newRandomCell();
      processField(buildGameField);
      isLose();
    }
  }
};

const arrDown = function(event) {
  if (controls.querySelector('.start') === null) {
    if (event.key === ARROWS.down && checkDown()) {
      moveDown();
      moveDownSum();
      moveDown();
      newRandomCell();
      processField(buildGameField);
      isLose();
    }
  }
};

const arrLeft = function(event) {
  if (controls.querySelector('.start') === null) {
    if (event.key === ARROWS.left && checkLeft()) {
      moveLeft();
      moveLeftSum();
      moveLeft();
      newRandomCell();
      processField(buildGameField);
      isLose();
    }
  }
};

const arrRight = function(event) {
  if (controls.querySelector('.start') === null) {
    if (event.key === ARROWS.right && checkRight()) {
      moveRight();
      moveRightSum();
      moveRight();
      newRandomCell();
      processField(buildGameField);
      isLose();
    }
  }
};

// Add keys listener

function addKeysListener() {
  document.addEventListener('keydown', arrUp);
  document.addEventListener('keydown', arrDown);
  document.addEventListener('keydown', arrLeft);
  document.addEventListener('keydown', arrRight);
}

// Remove keys listener

function removeKeysListener() {
  document.removeEventListener('keydown', arrUp);
  document.removeEventListener('keydown', arrDown);
  document.removeEventListener('keydown', arrLeft);
  document.removeEventListener('keydown', arrRight);
}
