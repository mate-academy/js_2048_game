'use strict';
// eslint-disable no-shadow

const cells = document.querySelectorAll('.field-cell');
const startBTN = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const isWinMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

let isWin = false;
const rowsCount = 4;
const cellsCount = 4;
let score = 0;

let gameBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

startBTN.addEventListener('click', (e) => {
  startGame();

  if (e.target.classList.contains('start')) {
    e.target.classList.remove('start');
    e.target.classList.add('restart');
    e.target.innerHTML = 'Restart';
  }

  messageStart.classList.add('hidden');
  isWinMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
});

const generateRandomNumber = () => {
  const row = Math.floor(Math.random() * rowsCount);
  const cell = Math.floor(Math.random() * cellsCount);

  if (gameBoard[row][cell] === 0) {
    gameBoard[row][cell] = (Math.random() >= 0.5) ? 4 : 2;
  }
};

const renderGameField = (field) => {
  let gameFieldIndex = 0;

  for (const cell of cells) {
    const i = Math.floor(gameFieldIndex / rowsCount);
    const j = gameFieldIndex % cellsCount;

    const fieldValue = gameBoard[i][j];

    gameFieldIndex++;

    if (gameBoard[i][j] === 0) {
      cell.innerHTML = '';
      cell.classList = 'field-cell';
    } else {
      cell.innerHTML = gameBoard[i][j];
      cell.classList.add(`field-cell--${fieldValue}`);
    }

    if (fieldValue === 2048) {
      isWin = true;
    }

    if (isWin) {
      isWinMessage.classList.remove('hidden');
    }
  }

  updateScore();

  if (isGameOver(gameBoard)) {
    if (startBTN.classList.contains('restart')) {
      startBTN.classList.replace('restart', 'start');
      startBTN.innerHTML = 'Start';
    }

    loseMessage.classList.remove('hidden');
  }
};

const updateScore = () => {
  gameScore.innerHTML = score;
};

const moveCell = (gameField, i, j, directionI, directionJ) => {
  let currI = i;
  let currJ = j;

  let newI = currI + directionI;
  let newJ = currJ + directionJ;

  while (
    newI >= 0
    && newI < 4
    && newJ >= 0
    && newJ < 4
    && !gameField[newI][newJ]
  ) {
    gameField[newI][newJ] = gameField[currI][currJ];
    gameField[currI][currJ] = 0;

    gameField[currI].className = '';

    currI = newI;
    currJ = newJ;

    newI += directionI;
    newJ += directionJ;
  }
};

const moveUp = (gameField) => {
  for (let i = 0; i < rowsCount; i++) {
    for (let j = 0; j < cellsCount; j++) {
      moveCell(gameField, i, j, -1, 0);
    }
  }
};

const mergeUp = (gameField) => {
  for (let i = 0; i < rowsCount - 1; i++) {
    for (let j = 0; j < cellsCount; j++) {
      if (gameField[i][j] === gameField[i + 1][j]) {
        gameField[i][j] = gameField[i][j] * 2;
        score += gameField[i][j];
        gameField[i + 1][j] = 0;
      }
    }
  }
};

const moveDown = (gameField) => {
  for (let i = rowsCount; i >= 0; i--) {
    for (let j = 0; j < cellsCount; j++) {
      moveCell(gameField, i, j, 1, 0);
    }
  }
};

const mergeDown = (gameField) => {
  for (let i = rowsCount - 1; i > 0; i--) {
    for (let j = 0; j < cellsCount; j++) {
      if (gameField[i][j] === gameField[i - 1][j]) {
        gameField[i][j] = gameField[i][j] * 2;
        score += gameField[i][j];
        gameField[i - 1][j] = 0;
      }
    }
  }
};

const moveLeft = (gameField) => {
  for (let i = 0; i < rowsCount; i++) {
    for (let j = 0; j < cellsCount; j++) {
      moveCell(gameField, i, j, 0, -1);
    }
  }
};

const mergeLeft = (gameField) => {
  for (let i = 0; i < rowsCount; i++) {
    for (let j = 0; j < cellsCount; j++) {
      if (gameField[i][j] === gameField[i][j + 1]) {
        gameField[i][j] = gameField[i][j] * 2;
        score += gameField[i][j];
        gameField[i][j + 1] = 0;
      }
    }
  }
};

const moveRight = (gameField) => {
  for (let i = 0; i < rowsCount; i++) {
    for (let j = cellsCount - 1; j >= 0; j--) {
      moveCell(gameField, i, j, 0, 1);
    }
  }
};

const mergeRight = (gameField) => {
  for (let i = 0; i < rowsCount; i++) {
    for (let j = cellsCount - 1; j >= 0; j--) {
      if (gameField[i][j] === gameField[i][j - 1]) {
        gameField[i][j] = gameField[i][j] * 2;
        score += gameField[i][j];
        gameField[i][j - 1] = 0;
      }
    }
  }
};

function hasEmpyCell(gameFields) {
  for (let i = 0; i < rowsCount; i++) {
    for (let j = 0; j < cellsCount; j++) {
      if (gameFields[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
}

function isGameOver(gameField) {
  if (hasEmpyCell(gameField)) {
    return false;
  }

  for (let i = 0; i < rowsCount; i++) {
    for (let j = 0; j < cellsCount - 1; j++) {
      if (gameField[i][j] === gameField[i][j + 1]) {
        return false;
      }
    }
  }

  for (let i = 0; i < rowsCount - 1; i++) {
    for (let j = 0; j < cellsCount; j++) {
      if (gameField[i][j] === gameField[i + 1][j]) {
        return false;
      }
    }
  }

  return true;
}

function startGame() {
  score = 0;

  gameBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  generateRandomNumber();
  renderGameField(gameBoard);
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      moveUp(gameBoard);
      mergeUp(gameBoard);
      moveUp(gameBoard);
      break;

    case 'ArrowDown':
      moveDown(gameBoard);
      mergeDown(gameBoard);
      moveDown(gameBoard);
      break;

    case 'ArrowLeft':
      moveLeft(gameBoard);
      mergeLeft(gameBoard);
      moveLeft(gameBoard);
      break;

    case 'ArrowRight':
      moveRight(gameBoard);
      mergeRight(gameBoard);
      moveRight(gameBoard);
      break;

    default:
      break;
  }

  generateRandomNumber();
  renderGameField(gameBoard);
});
