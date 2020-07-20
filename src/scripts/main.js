'use strict';

const container = document.querySelector('.container');
const controls = container.querySelector('.controls');
const startButton = controls.querySelector('.start');
const gameField = container.querySelector('.game-field');
const messages = container.querySelector('.message-container');
const startMessage = messages.querySelector('.message-start');
// const loseMessage = messages.querySelector('.message-lose');
const winMessage = messages.querySelector('.message-win');
const scoreValue = container.querySelector('.game-score');
let arrField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

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

// Change start button to restart

startButton.addEventListener('click', event => {
  startButton.remove();
  controls.append(createRestartButton());
  startMessage.classList.add('hidden');
  createTwoNewItem();
  calculateScore();
  loopArray(buildGameField);
});

// Reset game field

restartButton.addEventListener('click', event => {
  arrField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  createTwoNewItem();
  calculateScore();
  loopArray(buildGameField);
});

// Win message

function checkWin(number) {
  if (number === 2048) {
    winMessage.classList.remove('hidden');
  }
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
  if (Math.random() < 0.1) {
    return 4;
  } else {
    return 2;
  }
}

// Random position

function randomPosition() {
  return {
    row: Math.floor(Math.random() * 4),
    column: Math.floor(Math.random() * 4),
  };
}

// Calculate score

function calculateScore() {
  let totalScore = 0;

  for (const row of arrField) {
    for (const column of row) {
      totalScore += column;
    }
  }

  scoreValue.textContent = totalScore;
}

// New random cell

function newRandomCell() {
  const { row, column } = randomPosition();

  if (arrField[row][column] === 0) {
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

  checkWin(arrField[newRow][newColumn]);
}

// Loop array

function loopArray(action) {
  for (let row = 0; row < arrField.length; row++) {
    for (let column = 0; column < arrField[row].length; column++) {
      action(row, column);
    }
  }
}

// Move elements up

function moveUp(row, column) {
  if (arrField[row][column] > 0 && row - 1 >= 0) {
    if (arrField[row - 1][column] === 0) {
      moveElement(row, column, row - 1, column);

      return moveUp(row - 1, column);
    }

    if (arrField[row][column] === arrField[row - 1][column]
      && row - 1 >= 0) {
      sumElement(row, column, row - 1, column);
    }
  }
}

// Move elements down

function moveDown(row, column) {
  if (arrField[row][column] > 0 && row + 1 < arrField.length) {
    if (arrField[row + 1][column] === 0) {
      moveElement(row, column, row + 1, column);

      return moveDown(row + 1, column);
    }

    if (arrField[row][column] === arrField[row + 1][column]
      && row + 1 < arrField.length) {
      sumElement(row, column, row + 1, column);
    }
  }
}

// Move elements left

function moveLeft(row, column) {
  if (arrField[row][column] > 0 && column - 1 >= 0) {
    if (arrField[row][column - 1] === 0) {
      moveElement(row, column, row, column - 1);

      return moveLeft(row, column - 1);
    }

    if (arrField[row][column] === arrField[row][column - 1]
      && column - 1 >= 0) {
      sumElement(row, column, row, column - 1);
    }
  }
}

// Move elements right

function moveRight(row, column) {
  if (arrField[row][column] > 0 && column + 1 < arrField[row].length) {
    if (arrField[row][column + 1] === 0) {
      moveElement(row, column, row, column + 1);

      return moveRight(row, column + 1);
    }

    if (arrField[row][column] === arrField[row][column + 1]
      && column + 1 < arrField[row].length) {
      sumElement(row, column, row, column + 1);
    }
  }
}

// Press key

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowUp' && controls.querySelector('.start') === null) {
    loopArray(moveUp);
    newRandomCell();
    loopArray(buildGameField);
    calculateScore();
  }

  if (event.key === 'ArrowDown' && controls.querySelector('.start') === null) {
    loopArray(moveDown);
    newRandomCell();
    loopArray(buildGameField);
    calculateScore();
  }

  if (event.key === 'ArrowLeft' && controls.querySelector('.start') === null) {
    loopArray(moveLeft);
    newRandomCell();
    loopArray(buildGameField);
    calculateScore();
  }

  if (event.key === 'ArrowRight' && controls.querySelector('.start') === null) {
    loopArray(moveRight);
    newRandomCell();
    loopArray(buildGameField);
    calculateScore();
  }
});
