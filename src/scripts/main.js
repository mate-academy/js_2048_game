'use strict';

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const scoreElement = document.querySelector('.game-score');
const scoreAnimation = document.querySelector('.current-score-animation');
const bestScoreElement = document.querySelector('.best-score');
const allRows = [...document.querySelectorAll('.field-row')];
const gameFiledMatrix = allRows
  .map(row => [...row.querySelectorAll('.field-cell')].map(cell => cell));
const valuesMatrix = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const animationNames = {
  left: 'animation left',
  right: 'animation right',
  up: 'animation up',
  down: 'animation down',
};
let score = 0;
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;

window.addEventListener('load', () => {
  bestScoreElement.textContent = bestScore;
});

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');
    randomNum();
    randomNum();
  } else {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    messageStart.classList.remove('hidden');

    if (!messageLose.classList.contains('hidden')) {
      messageLose.classList.add('hidden');
      document.addEventListener('keydown', handleKeyDown);
    }

    if (!messageWin.classList.contains('hidden')) {
      messageWin.classList.add('hidden');
      document.addEventListener('keydown', handleKeyDown);
    }
    cellsClear();
  };
});

function randomNum() {
  const randomRow = Math.floor(Math.random() * 4);
  const randomCell = Math.floor(Math.random() * 4);
  const chanceOfFour = +Math.random().toFixed(2);
  const value = valuesMatrix[randomRow][randomCell];
  const startNumbFour = 4;
  const startNumbTwo = 2;

  if (value === 0) {
    if (chanceOfFour <= 0.1) {
      valuesMatrix[randomRow][randomCell] = startNumbFour;
      gameFiledMatrix[randomRow][randomCell].textContent = startNumbFour;

      gameFiledMatrix[randomRow][randomCell]
        .className = `field-cell field-cell--${startNumbFour} `
        + `field-cell--animation-new-cell`;
    } else {
      valuesMatrix[randomRow][randomCell] = startNumbTwo;
      gameFiledMatrix[randomRow][randomCell].textContent = startNumbTwo;

      gameFiledMatrix[randomRow][randomCell]
        .className = `field-cell field-cell--${startNumbTwo} `
        + `field-cell--animation-new-cell`;
    };
  } else {
    return randomNum();
  };
}

function cellsClear() {
  scoreElement.textContent = 0;
  score = 0;

  valuesMatrix.forEach((line, rowIndex) => line.forEach((value, cellIndex) => {
    if (value !== 0) {
      valuesMatrix[rowIndex][cellIndex] = 0;
      removeCells(gameFiledMatrix[rowIndex][cellIndex]);
    }
  }));
}

document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(keyboard) {
  const shallowCopy = valuesMatrix.map(row => row.map(cell => cell));
  const arrowLeftKey = 'ArrowLeft';
  const arrowRightKey = 'ArrowRight';
  const arrowUpKey = 'ArrowUp';
  const arrowDownKey = 'ArrowDown';

  if (button.classList.contains('start')) {
    return;
  }

  if (!moveLeft(shallowCopy)
    && !moveRight(shallowCopy)
    && !moveUp(shallowCopy)
    && !moveDown(shallowCopy)) {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keydown', handleKeyDown);
  }

  switch (keyboard.code) {
    case arrowLeftKey:
      if (moveLeft(valuesMatrix, 'updateScore')) {
        randomNum();
        rendering(animationNames.left);
        findWinNum();
      };
      break;

    case arrowRightKey:
      if (moveRight(valuesMatrix, 'updateScore')) {
        randomNum();
        rendering(animationNames.right);
        findWinNum();
      };
      break;

    case arrowUpKey:
      if (moveUp(valuesMatrix, 'updateScore')) {
        randomNum();
        rendering(animationNames.up);
        findWinNum();
      };
      break;

    case arrowDownKey:
      if (moveDown(valuesMatrix, 'updateScore')) {
        randomNum();
        rendering(animationNames.down);
        findWinNum();
      };
      break;
  }
};

function moveLeft(matrix, shouldUpdateScore, shouldMergeRight) {
  let result = false;

  const mutatedMatrix = matrix
    .map(row => mergeRow(row, shouldUpdateScore, shouldMergeRight));

  matrix.forEach((row, rowIndex) => {
    if (row.toString() !== mutatedMatrix[rowIndex].toString()) {
      result = true;
      matrix[rowIndex] = mutatedMatrix[rowIndex];
    }
  });

  return result;
}

function moveRight(matrix, shouldUpdateScore) {
  let result = false;

  const mutatedMatrix = matrix
    .map(row => mergeRowRight(row, shouldUpdateScore));

  matrix.forEach((row, rowIndex) => {
    if (row.toString() !== mutatedMatrix[rowIndex].toString()) {
      result = true;
      matrix[rowIndex] = mutatedMatrix[rowIndex];
    }
  });

  return result;
}

function moveUp(matrix, shouldUpdateScore, shouldMergeRight) {
  let result = false;

  for (let cell = 0; cell < 4; cell++) {
    const column = [];

    for (let row = 0; row < 4; row++) {
      column.push(matrix[row][cell]);
    }

    const finalColumn = mergeRow(column, shouldUpdateScore, shouldMergeRight);

    for (let row = 0; row < 4; row++) {
      if (matrix[row][cell] !== finalColumn[row]) {
        matrix[row][cell] = finalColumn[row];
        result = true;
      }
    }
  }

  return result;
}

function moveDown(matrix, shouldUpdateScore, shouldMergeRight) {
  let result = false;

  for (let cell = 0; cell < 4; cell++) {
    const column = [];

    for (let row = 3; row >= 0; row--) {
      column.push(matrix[row][cell]);
    }

    const finalColumn = mergeRow(column, shouldUpdateScore, shouldMergeRight);

    for (let row = 3; row >= 0; row--) {
      if (matrix[row][cell] !== finalColumn[finalColumn.length - 1 - row]) {
        matrix[row][cell] = finalColumn[finalColumn.length - 1 - row];
        result = true;
      }
    }
  }

  return result;
}

function rendering(animation) {
  if (score > bestScore) {
    bestScore = score;
    bestScoreElement.textContent = bestScore;
    localStorage.setItem('bestScore', bestScore);
  }

  scoreElement.textContent = score;

  for (let row = 0; row < 4; row++) {
    for (let cell = 0; cell < 4; cell++) {
      const matrixValue = valuesMatrix[row][cell];
      const cellValue = gameFiledMatrix[row][cell].textContent;

      if (!matrixValue && cellValue) {
        removeCells(gameFiledMatrix[row][cell]);
        continue;
      }

      if (matrixValue !== +cellValue) {
        gameFiledMatrix[row][cell].textContent = matrixValue;

        switch (animation) {
          case animationNames.right:
            gameFiledMatrix[row][cell]
              .className = `field-cell field-cell--${matrixValue} `
              + `field-cell--animation-right`;
            break;

          case animationNames.left:
            gameFiledMatrix[row][cell]
              .className = `field-cell field-cell--${matrixValue} `
              + `field-cell--animation-left`;
            break;

          case animationNames.up:
            gameFiledMatrix[row][cell]
              .className = `field-cell field-cell--${matrixValue} `
              + `field-cell--animation-up`;
            break;

          case animationNames.down:
            gameFiledMatrix[row][cell]
              .className = `field-cell field-cell--${matrixValue} `
              + `field-cell--animation-down`;
        }
      }
    }
  }
}

function findWinNum() {
  valuesMatrix.forEach(row => row.forEach(cell => {
    if (cell === 2048) {
      messageWin.classList.remove('hidden');
      document.removeEventListener('keydown', handleKeyDown);
    }
  }));
}

function mergeRow(matrixRow, shouldUpdateScore) {
  const filteredArray = matrixRow.filter(cell => cell !== 0);

  if (filteredArray.length === 0) {
    return matrixRow;
  }

  if (filteredArray.length > 1) {
    for (let i = 0; i < filteredArray.length; i++) {
      if (filteredArray[i] === filteredArray[i + 1]) {
        filteredArray[i] *= 2;

        if (shouldUpdateScore === 'updateScore') {
          score += filteredArray[i];
          addScoreAnimation(filteredArray[i]);
        }
        filteredArray.splice(i + 1, 1);
      }
    }
  }

  const fillIndex = filteredArray.length;

  filteredArray.length = matrixRow.length;

  const finalArray = filteredArray.fill(0, fillIndex);

  return finalArray;
}

function mergeRowRight(matrixRow, shouldUpdateScore) {
  const filteredArray = matrixRow.filter(cell => cell !== 0);
  let multiply = 0;

  if (filteredArray.length === 0) {
    return matrixRow;
  }

  if (filteredArray.length > 1) {
    for (let i = filteredArray.length - 1; i >= 0; i--) {
      if (filteredArray[i] === filteredArray[i - 1]
        && filteredArray[i] !== multiply) {
        filteredArray[i] *= 2;
        multiply = filteredArray[i];

        if (shouldUpdateScore === 'updateScore') {
          score += filteredArray[i];
          addScoreAnimation(filteredArray[i]);
        }
        filteredArray.splice(i - 1, 1);
      }
    }
  }

  const missingZero = [];

  missingZero.length = matrixRow.length - filteredArray.length;
  missingZero.fill(0);

  return [...missingZero, ...filteredArray];
}

function addScoreAnimation(value) {
  scoreAnimation.textContent = `+${value}`;
  scoreAnimation.classList.remove('hidden');

  setTimeout(() => {
    scoreAnimation.classList.add('hidden');
  }, 500);
}

function removeCells(fieldMatrix) {
  fieldMatrix.classList
    .add('field-cell--animation-remove-cell-in');

  setTimeout(() => {
    fieldMatrix.textContent = '';

    fieldMatrix
      .className = `field-cell field-cell--animation-remove-cell-out`;
  }, 400);
}
