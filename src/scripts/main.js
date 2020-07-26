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
const winNumber = 2048;
let totalScore = 0;
let arrField = [];
const FIELD_SIZE = {
  rows: 4,
  columns: 4,
};
const ARROWS = {
  'ArrowUp': 'ArrowUp',
  'ArrowRight': 'ArrowRight',
  'ArrowDown': 'ArrowDown',
  'ArrowLeft': 'ArrowLeft',
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

// Win message

function checkWin(number) {
  if (number === winNumber) {
    winMessage.classList.remove('hidden');
    removeKeysListener();
  }
}

// Lose message

function lose() {
  loseMessage.classList.remove('hidden');
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
  checkWin(arrField[newRow][newColumn]);
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
  for (let row = arrField.length - 1; row >= 1; row--) {
    for (let column = 0; column < arrField[row].length; column++) {
      if (arrField[row][column] > 0 && row - 1 >= 0) {
        if (arrField[row - 1][column] === 0) {
          moveElement(row, column, row - 1, column);

          return moveUp();
        }

        if (arrField[row][column] === arrField[row - 1][column]
          && row - 1 >= 0) {
          sumElement(row, column, row - 1, column);
        }
      }
    }
  }
}

// Move elements down

function moveDown() {
  for (let row = 0; row < arrField.length - 1; row++) {
    for (let column = 0; column < arrField[row].length; column++) {
      if (arrField[row][column] > 0 && row + 1 < arrField.length) {
        if (arrField[row + 1][column] === 0) {
          moveElement(row, column, row + 1, column);

          return moveDown();
        }

        if (arrField[row][column] === arrField[row + 1][column]
          && row + 1 < arrField.length) {
          sumElement(row, column, row + 1, column);
        }
      }
    }
  }
}

// Move elements left

function moveLeft() {
  for (let row = 0; row < arrField.length; row++) {
    for (let column = arrField[row].length - 1; column >= 1; column--) {
      if (arrField[row][column] > 0 && column - 1 >= 0) {
        if (arrField[row][column - 1] === 0) {
          moveElement(row, column, row, column - 1);

          return moveLeft();
        }

        if (arrField[row][column] === arrField[row][column - 1]
          && column - 1 >= 0) {
          sumElement(row, column, row, column - 1);
        }
      }
    }
  }
}

// Move elements right

function moveRight() {
  for (let row = 0; row < arrField.length; row++) {
    for (let column = 0; column < arrField[row].length - 1; column++) {
      if (arrField[row][column] > 0 && column + 1 < arrField[row].length) {
        if (arrField[row][column + 1] === 0) {
          moveElement(row, column, row, column + 1);

          return moveRight();
        }

        if (arrField[row][column] === arrField[row][column + 1]
          && column + 1 < arrField[row].length) {
          sumElement(row, column, row, column + 1);
        }
      }
    }
  }
}

// Check up

function checkUp() {
  for (let row = arrField.length - 1; row >= 1; row--) {
    for (let column = 0; column < arrField[row].length; column++) {
      if (arrField[row][column] > 0
        && (arrField[row][column] === arrField[row - 1][column]
          || arrField[row - 1][column] === 0)) {
        return true;
      }
    }
  }

  return false;
}

// Check down

function checkDown() {
  for (let row = 0; row < arrField.length - 1; row++) {
    for (let column = 0; column < arrField[row].length; column++) {
      if (arrField[row][column] > 0
        && (arrField[row][column] === arrField[row + 1][column]
          || arrField[row + 1][column] === 0)) {
        return true;
      }
    }
  }

  return false;
}

// Check Left

function checkLeft() {
  for (let row = 0; row < arrField.length; row++) {
    for (let column = arrField[row].length - 1; column >= 1; column--) {
      if (arrField[row][column] > 0
        && (arrField[row][column] === arrField[row][column - 1]
          || arrField[row][column - 1] === 0)) {
        return true;
      }
    }
  }

  return false;
}

// Check right

function checkRight() {
  for (let row = 0; row < arrField.length; row++) {
    for (let column = 0; column < arrField[row].length - 1; column++) {
      if (arrField[row][column] > 0
        && (arrField[row][column] === arrField[row][column + 1]
          || arrField[row][column + 1] === 0)) {
        return true;
      }
    }
  }

  return false;
}

// Check lose

function checkLose() {
  if (checkUp() || checkDown() || checkLeft() || checkRight()) {
    return true;
  }
  removeKeysListener();
  lose();
}

// Press key

const arrUp = function(event) {
  if (controls.querySelector('.start') === null) {
    if (event.key === ARROWS.ArrowUp && checkUp()) {
      moveUp();
      newRandomCell();
      processField(buildGameField);
      checkLose();
    }
  }
};

const arrDown = function(event) {
  if (controls.querySelector('.start') === null) {
    if (event.key === ARROWS.ArrowDown && checkDown()) {
      moveDown();
      newRandomCell();
      processField(buildGameField);
      checkLose();
    }
  }
};

const arrLeft = function(event) {
  if (controls.querySelector('.start') === null) {
    if (event.key === ARROWS.ArrowLeft && checkLeft()) {
      moveLeft();
      newRandomCell();
      processField(buildGameField);
      checkLose();
    }
  }
};

const arrRight = function(event) {
  if (controls.querySelector('.start') === null) {
    if (event.key === ARROWS.ArrowRight && checkRight()) {
      moveRight();
      newRandomCell();
      processField(buildGameField);
      checkLose();
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
