'use strict';

//  select the game container
const container = document.querySelector('.container');

const domField = container.querySelector('.game-field');

// all the messages for the game
const messages = container.querySelector('.message-container');
const startMessage = messages.querySelector('.message-start');
const loserMessage = messages.querySelector('.message-lose');
const winnerMessage = messages.querySelector('.message-win');

// the header with logo, button and score value
const header = container.querySelector('.controls');
const startButton = header.querySelector('.start');

// create restart button
const restartButton = document.createElement('button');

// and config it
restartButton.classList.add('restart', 'button');
restartButton.textContent = 'Restart';

// select score container
const scoreContainer = container.querySelector('.game-score');

// define the score which then we will push to scoreContainer
let currentScore = 0;

let matrixModel = [];

const size = 4;
// Create array field

function createMatrix(matrixSize) {
  matrixModel = new Array(matrixSize);

  for (let i = 0; i < matrixSize; i++) {
    matrixModel[i] = new Array(matrixSize);

    for (let j = 0; j < 4; j++) {
      matrixModel[i][j] = 0;
    }
  }
}

createMatrix(size);

// Start game & change start button to restart

startButton.addEventListener('click', event => {
  startButton.remove();
  header.append(restartButton);
  startMessage.classList.add('hidden');
  generate();
  generate();
  render();
  window.addEventListener('keydown', checkKey);
});

// Restart game & reset game field

restartButton.addEventListener('click', event => {
  loserMessage.classList.add('hidden');
  currentScore = 0;
  scoreContainer.textContent = currentScore;
  createMatrix(size);
  generate();
  generate();
  render();
  window.addEventListener('keydown', checkKey);
});

// Build game field
function render() {
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const fieldCell = domField.rows[row].cells[column];

      fieldCell.classList = ['field-cell'];

      if (matrixModel[row][column] > 0) {
        fieldCell.classList.add(`field-cell--${matrixModel[row][column]}`);
        fieldCell.textContent = `${matrixModel[row][column]}`;
      } else {
        fieldCell.textContent = '';
      }

      if (matrixModel[row][column] === 2048) {
        winnerMessage.classList.remove('hidden');
        window.romoveEventListener('keydown', checkKey);
      }
    }
  }
}

function generate() {
  const arrayOfFreeSpaces = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (matrixModel[i][j] === 0) {
        arrayOfFreeSpaces.push([i, j]);
      }
    }
  }

  const [ r, c ]
      = arrayOfFreeSpaces[Math.floor(Math.random() * arrayOfFreeSpaces.length)];

  matrixModel[r][c] = Math.random() <= 0.1 ? 4 : 2;
}

function checkKey(event) {
  event.preventDefault();

  // checks to know can we do move up
  const canMoveU = () => {
    for (let column = 0; column < size; column++) {
      for (let row = 1; row < size; row++) {
        if (matrixModel[row][column] > 0
            && (matrixModel[row - 1][column] === matrixModel[row][column]
              || matrixModel[row - 1][column] === 0)) {
          return true;
        }
      }
    }

    return false;
  };

  // checks to know can we do move down
  const canMoveD = () => {
    for (let column = 0; column < size; column++) {
      for (let row = size - 1; row >= 1; row--) {
        if (matrixModel[row - 1][column] > 0
          && (matrixModel[row][column] === matrixModel[row - 1][column]
            || matrixModel[row][column] === 0)) {
          return true;
        }
      }
    }

    return false;
  };

  // checks to know can we do move right
  const canMoveR = () => {
    for (let row = 0; row < size; row++) {
      for (let column = size - 1; column >= 1; column--) {
        if (matrixModel[row][column - 1] > 0
          && (matrixModel[row][column] === matrixModel[row][column - 1]
            || matrixModel[row][column] === 0)) {
          return true;
        }
      }
    }

    return false;
  };

  // checks to know can we do move left
  const canMoveL = () => {
    for (let row = 0; row < size; row++) {
      for (let column = 1; column < size; column++) {
        if (matrixModel[row][column] > 0
          && (matrixModel[row][column] === matrixModel[row][column - 1]
            || matrixModel[row][column - 1] === 0)) {
          return true;
        }
      }
    }

    return false;
  };

  if (!canMoveD() && !canMoveL() && !canMoveR() && !canMoveU()) {
    loserMessage.classList.remove('hidden');
    window.romoveEventListener('keydown', checkKey);
  }

  if (event.keyCode === 38) {
    if (canMoveU()) {
      moveUp();
      combineUp();
      generate();
      render();
    }
  } else if (event.keyCode === 40) {
    if (canMoveD()) {
      moveDown();
      combineDown();
      generate();
      render();
    }
  } else if (event.keyCode === 37) {
    if (canMoveL()) {
      moveLeft();
      combineLeft();
      generate();
      render();
    }
  } else if (event.keyCode === 39) {
    if (canMoveR()) {
      moveRight();
      combineRight();
      generate();
      render();
    }
  }
}

// cells of each column move up untill
// all existed moves in current column be done
function moveUp() {
  for (let column = 0; column < size; column++) {
    let isMoved = false;

    for (let row = 1; row < size; row++) {
      if (matrixModel[row - 1][column] === 0
          && matrixModel[row][column] > 0) {
        matrixModel[row - 1][column] = matrixModel[row][column];
        matrixModel[row][column] = 0;
        isMoved = true;
      }
    }

    if (isMoved) {
      return moveUp();
    }
  }
}

//  combine cells if they are equal and then call move function
function combineUp() {
  for (let column = 0; column < size; column++) {
    for (let row = 1; row < size; row++) {
      if (matrixModel[row - 1][column] === matrixModel[row][column]
        && matrixModel[row][column] > 0) {
        matrixModel[row - 1][column] *= 2;
        matrixModel[row][column] = 0;
        currentScore += matrixModel[row - 1][column];
        scoreContainer.textContent = currentScore;
        moveUp();
      }
    }
  }
}

// cells of each column move down untill
// all existed moves in current column be done
function moveDown() {
  for (let column = 0; column < size; column++) {
    let isMoved = false;

    for (let row = size - 1; row >= 1; row--) {
      if (matrixModel[row][column] === 0
        && matrixModel[row - 1][column] > 0) {
        matrixModel[row][column] = matrixModel[row - 1][column];
        matrixModel[row - 1][column] = 0;
        isMoved = true;
      }
    }

    if (isMoved) {
      return moveDown();
    }
  }
}

//  combine cells if they are equal and then call move function
function combineDown() {
  for (let column = 0; column < size; column++) {
    for (let row = size - 1; row >= 1; row--) {
      if (matrixModel[row - 1][column] === matrixModel[row][column]
        && matrixModel[row][column] > 0) {
        matrixModel[row - 1][column] *= 2;
        matrixModel[row][column] = 0;
        currentScore += matrixModel[row - 1][column];
        scoreContainer.textContent = currentScore;
        moveDown();
      }
    }
  }
}

// cells of each row move left untill
// all existed moves in current row be done
function moveLeft() {
  for (let row = 0; row < size; row++) {
    let isMoved = false;

    for (let column = 1; column < size; column++) {
      if (matrixModel[row][column - 1] === 0
        && matrixModel[row][column] > 0) {
        matrixModel[row][column - 1] = matrixModel[row][column];
        matrixModel[row][column] = 0;
        isMoved = true;
      }
    }

    if (isMoved) {
      return moveLeft();
    }
  }
}

//  combine cells if they are equal and then call move function
function combineLeft() {
  for (let row = 0; row < size; row++) {
    for (let column = 1; column < size; column++) {
      if (matrixModel[row][column - 1] === matrixModel[row][column]
        && matrixModel[row][column] > 0) {
        matrixModel[row][column - 1] *= 2;
        matrixModel[row][column] = 0;
        currentScore += matrixModel[row][column - 1];
        scoreContainer.textContent = currentScore;
        moveLeft();
      }
    }
  }
}

// cells of each row move right untill
// all existed moves in current row be done
function moveRight() {
  for (let row = 0; row < size; row++) {
    let isMoved = false;

    for (let column = size - 1; column >= 1; column--) {
      if (matrixModel[row][column] === 0
        && matrixModel[row][column - 1] > 0) {
        matrixModel[row][column] = matrixModel[row][column - 1];
        matrixModel[row][column - 1] = 0;
        isMoved = true;
      }
    }

    if (isMoved) {
      return moveRight();
    }
  }
}

//  combine cells if they are equal and then call move functiongi
function combineRight() {
  for (let row = 0; row < size; row++) {
    for (let column = size - 1; column >= 1; column--) {
      if (matrixModel[row][column - 1] === matrixModel[row][column]
        && matrixModel[row][column] > 0) {
        matrixModel[row][column - 1] *= 2;
        matrixModel[row][column] = 0;
        currentScore += matrixModel[row][column - 1];
        scoreContainer.textContent = currentScore;
        moveRight(row, column);
      }
    }
  }
}
