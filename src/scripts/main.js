'use strict';

const rowLength = 4;
const columnLength = 4;
let score = 0;
const button = document.querySelector('button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

let field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

button.addEventListener('click', buttonHandler);
document.body.addEventListener('keydown', move);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomProbability() {
  return (Math.random() * 1.01).toFixed(2);
}

function addRandomNumber(gameField) {
  const emptyCells = [];

  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < columnLength; j++) {
      if (gameField[i][j] === 0) {
        emptyCells.push([i, j]);
      }
    }
  }

  if (emptyCells.length === 0) {
    return;
  }

  const randomIndex = getRandomInt(emptyCells.length);
  const randomIndexes = emptyCells[randomIndex];

  if (getRandomProbability() < 0.9) {
    gameField[randomIndexes[0]][randomIndexes[1]] = 2;
  } else {
    gameField[randomIndexes[0]][randomIndexes[1]] = 4;
  }
}

function renderField(gameField) {
  const cells = document.querySelectorAll('.field-cell');
  let isWin = false;
  let gameFieldIndex = 0;

  for (const cell of cells) {
    const i = Math.floor(gameFieldIndex / rowLength);
    const j = gameFieldIndex % columnLength;
    const fieldValue = gameField[i][j];

    gameFieldIndex++;

    cell.classList = 'field-cell';

    if (fieldValue === 0) {
      cell.innerHTML = '';
    } else {
      cell.innerHTML = fieldValue;
      cell.classList.add(`field-cell--${fieldValue}`);
    }

    if (fieldValue === 2048) {
      isWin = true;
    }
  }

  if (isWin) {
    showWinMessage();
  }

  updateScore(score);

  if (isGameOver(gameField)) {
    if (button.classList.contains('restart')) {
      button.classList.replace('restart', 'start');
      button.innerText = 'Start';
    }
    loseMessage.classList.remove('hidden');
  }
}

function updateScore(gameScore) {
  const scoreField = document.querySelector('.game-score');

  scoreField.innerHTML = `${gameScore}`;
}

function hasEmptyCell(gameField) {
  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < columnLength; j++) {
      if (gameField[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
}

function isGameOver(gameField) {
  if (hasEmptyCell(gameField)) {
    return false;
  }

  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < columnLength - 1; j++) {
      if (gameField[i][j] === gameField[i][j + 1]) {
        return false;
      }
    }
  }

  for (let i = 0; i < rowLength - 1; i++) {
    for (let j = 0; j < columnLength; j++) {
      if (gameField[i][j] === gameField[i + 1][j]) {
        return false;
      }
    }
  }

  return true;
}

function showWinMessage() {
  winMessage.classList.remove('hidden');
}

function buttonHandler() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;
  loseMessage.classList.toggle('hidden', true);
  winMessage.classList.toggle('hidden', true);

  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';
    startMessage.classList.add('hidden');
  }

  addRandomNumber(field);
  addRandomNumber(field);
  renderField(field);
}

function moveCell(gameField, i, j, directionI, directionJ) {
  let currentI = i;
  let currentJ = j;
  let newI = i + directionI;
  let newJ = j + directionJ;

  while (newI >= 0 && newI < 4 && newJ >= 0 && newJ < 4
    && !gameField[newI][newJ]) {
    gameField[newI][newJ] = gameField[currentI][currentJ];
    gameField[currentI][currentJ] = 0;
    currentI = newI;
    currentJ = newJ;
    newI += directionI;
    newJ += directionJ;
  }
}

function moveUp(gameField) {
  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < columnLength; j++) {
      if (!gameField[i][j]) {
        continue;
      }
      moveCell(gameField, i, j, -1, 0);
    }
  }
}

function mergeUp(gameField) {
  for (let i = 0; i < rowLength - 1; i++) {
    for (let j = 0; j < columnLength; j++) {
      if (!gameField[i][j]) {
        continue;
      }

      if (gameField[i][j] === gameField[i + 1][j]) {
        gameField[i][j] = gameField[i][j] * 2;
        score += gameField[i][j];
        gameField[i + 1][j] = 0;
      }
    }
  }
}

function moveDown(gameField) {
  for (let i = rowLength - 1; i >= 0; i--) {
    for (let j = 0; j < columnLength; j++) {
      if (!gameField[i][j]) {
        continue;
      }
      moveCell(gameField, i, j, 1, 0);
    }
  }
}

function mergeDown(gameField) {
  for (let i = rowLength - 1; i > 0; i--) {
    for (let j = 0; j < columnLength; j++) {
      if (!gameField[i][j]) {
        continue;
      }

      if (gameField[i][j] === gameField[i - 1][j]) {
        gameField[i][j] = gameField[i][j] * 2;
        score += gameField[i][j];
        gameField[i - 1][j] = 0;
      }
    }
  }
}

function moveRight(gameField) {
  for (let i = 0; i < rowLength; i++) {
    for (let j = columnLength - 1; j >= 0; j--) {
      if (!gameField[i][j]) {
        continue;
      }
      moveCell(gameField, i, j, 0, 1);
    }
  }

  return gameField;
}

function mergeRight(gameField) {
  for (let i = 0; i < rowLength; i++) {
    for (let j = columnLength - 1; j > 0; j--) {
      if (!gameField[i][j]) {
        continue;
      }

      if (gameField[i][j] === gameField[i][j - 1]) {
        gameField[i][j] = gameField[i][j] * 2;
        score += gameField[i][j];
        gameField[i][j - 1] = 0;
      }
    }
  }
}

function moveLeft(gameField) {
  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < columnLength; j++) {
      if (!gameField[i][j]) {
        continue;
      }
      moveCell(gameField, i, j, 0, -1);
    }
  }
}

function mergeLeft(gameField) {
  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < columnLength; j++) {
      if (!gameField[i][j]) {
        continue;
      }

      if (gameField[i][j] === gameField[i][j - 1]) {
        gameField[i][j] = gameField[i][j] * 2;
        score += gameField[i][j];
        gameField[i][j - 1] = 0;
      }
    }
  }
}

function move(e) {
  if (!button.classList.contains('restart')) {
    return;
  }

  const fieldCopy = field.map(function(arr) {
    return arr.slice();
  });

  switch (e.key) {
    case 'ArrowUp':
      moveUp(field);
      mergeUp(field);
      moveUp(field);
      break;

    case 'ArrowDown':
      moveDown(field);
      mergeDown(field);
      moveDown(field);
      break;

    case 'ArrowRight':
      moveRight(field);
      mergeRight(field);
      moveRight(field);
      break;

    case 'ArrowLeft':
      moveLeft(field);
      mergeLeft(field);
      moveLeft(field);
      break;
  }

  if (isFieldChanged(field, fieldCopy)) {
    addRandomNumber(field);
  }

  renderField(field);
}

function isFieldChanged(gameField, gameFieldUpdated) {
  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < columnLength; j++) {
      if (gameField[i][j] !== gameFieldUpdated[i][j]) {
        return true;
      }
    }
  }

  return false;
}
