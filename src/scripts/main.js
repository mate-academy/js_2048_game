'use strict';

const renderedField = document.querySelector('.game-field tbody');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startButton = document.querySelector('.start');
const scoreLabel = document.querySelector('.game-score');
let scoreAmount = 0;
let isGameStarted = false;
let isGameWon = false;
let isGameLost = false;
let isGameFieldChanged = false;

let currentScore = 0;

const NUMBER_OF_ROWS = 4;
const NUMBER_OF_COLUMNS = NUMBER_OF_ROWS;
const WIN_SCORE = 2048;

let gameFieldX = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

document.addEventListener('onload', render());

startButton.addEventListener('click', () => {
  isGameStarted = true;
  startMessage.classList.add('hidden');
  initStartData();
  setSpecificValueIntoGameField(gameFieldX);
  setSpecificValueIntoGameField(gameFieldX);
  render();
});

function initStartData() {
  for (const row of gameFieldX) {
    row.fill(0);
  }

  isGameLost = false;
  isGameWon = false;
  startButton.innerText = 'Restart';
  startButton.classList.add('restart');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  render();
}

function render() {
  scoreLabel.innerText = scoreAmount;

  const rows = renderedField.children;

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].children;

    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];

      cell.classList.remove(`field-cell--${cell.innerText}`);
      cell.innerText = gameFieldX[i][j] === 0 ? '' : gameFieldX[i][j];
      cell.classList.add(`field-cell--${gameFieldX[i][j]}`);
    }
  }
}

function isZeroPresent() {
  return [].concat(...gameFieldX).some(item => item === 0);
}

function getIndexesOfAllCellsWithZeros() {
  const zeros = [].concat(...gameFieldX)
    .map((value, index) => ({
      value, index,
    }))
    .filter(el => el.value === 0)
    .map(el => el.index);

  return zeros;
}

function getRandomZeroCellCoordinates() {
  const zeros = getIndexesOfAllCellsWithZeros();

  const randomIndex = getRandomValue(0, zeros.length - 1);

  return {
    y: Math.floor(zeros[randomIndex] / NUMBER_OF_COLUMNS),
    x: zeros[randomIndex] % NUMBER_OF_COLUMNS,
  };
}

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getSpecificValue() {
  const value = getRandomValue(1, 10);

  return value === 4 ? value : 2;
}

function setSpecificValueIntoGameField(gameField) {
  if (isZeroPresent()) {
    const coords = getRandomZeroCellCoordinates();

    gameField[coords.y][coords.x] = getSpecificValue();
  }
}

function transposeArray(matrix) {
  return matrix.map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function normalizeGameField(gameField, direction) {
  const newGameField = (direction === 'ArrowLeft' || direction === 'ArrowRight')
    ? [...gameField]
    : transposeArray(gameField);

  for (let i = 0; i < newGameField.length; i++) {
    newGameField[i] = (direction === 'ArrowLeft' || direction === 'ArrowUp')
      ? normalizeRow(newGameField[i])
      : normalizeRow(newGameField[i].reverse()).reverse();
  }

  gameFieldX = (direction === 'ArrowLeft' || direction === 'ArrowRight')
    ? newGameField
    : transposeArray(newGameField);

  isGameLost = !isZeroPresent()
    && !isThereMove(gameFieldX)
    && !isThereMove(transposeArray(gameFieldX));

  if (isGameLost) {
  }
}

document.addEventListener('keydown', (arrowEvent) => {
  const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (isGameStarted && keys.includes(arrowEvent.key)) {
    normalizeGameField(gameFieldX, arrowEvent.key);

    if (isGameFieldChanged) {
      setSpecificValueIntoGameField(gameFieldX);
      isGameFieldChanged = false;
    }

    if (isGameWon) {
      isGameStarted = false;
      startMessage.classList.add('hidden');
      winMessage.classList.remove('hidden');
    }

    if (isGameLost) {
      isGameStarted = false;
      startMessage.classList.add('hidden');
      loseMessage.classList.remove('hidden');
    }
    render();
  }
});

function normalizeRow(row) {
  let zeroIndex = row.findIndex(el => el === 0);
  let prevValueIndex;

  for (let i = 0; i < row.length; i++) {
    if (row[i] !== 0) {
      if (row[prevValueIndex] === row[i]) {
        currentScore = row[i] * 2;
        row[prevValueIndex] = currentScore;
        scoreAmount += currentScore;
        prevValueIndex = i;
        row[i] = 0;

        if (!isGameWon) {
          isGameWon = currentScore === WIN_SCORE;
        }
        isGameFieldChanged = true;
      } else {
        prevValueIndex = i;
      }

      if (zeroIndex < i && zeroIndex >= 0) {
        row[zeroIndex] = row[i];
        row[i] = 0;
        prevValueIndex = zeroIndex;
        isGameFieldChanged = true;
      }
      zeroIndex = row.findIndex(el => el === 0);
    }
  }

  return row;
}

function isThereMoveInRow(row) {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      return true;
    }
  }

  return false;
}

function isThereMove(gameField) {
  for (const row of gameField) {
    if (isThereMoveInRow(row)) {
      return true;
    }
  }

  return false;
}
