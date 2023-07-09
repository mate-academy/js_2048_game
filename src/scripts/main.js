'use strict';

const clone = (items) => items
  .map(item => Array.isArray(item) ? clone(item) : item);

const button = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const gameScore = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

let field = [];
let score = 0;

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    startMessage.classList.add('hidden');
    button.textContent = 'Restart';
  }

  field = createField();
  score = 0;
  gameScore.textContent = score;
  messageLose.classList.add('hidden');
});

document.addEventListener('keydown', keyEvent => {
  switch (keyEvent.key) {
    case 'ArrowUp':
      score = moveUp(field, score);
      break;

    case 'ArrowDown':
      score = moveDown(field, score);
      break;

    case 'ArrowRight':
      score = moveRight(field, score);
      break;

    case 'ArrowLeft':
      score = moveLeft(field, score);
      break;

    default:
      throw new Error('Wrong key!');
  }

  if (checkWin(field)) {
    messageWin.classList.remove('hidden');
  }

  if (!hasEmptyCell(field)) {
    const copyField = clone(field);

    moveUp(copyField, 0);
    moveDown(copyField, 0);
    moveRight(copyField, 0);
    moveLeft(copyField, 0);

    if (JSON.stringify(copyField) === JSON.stringify(field)) {
      messageLose.classList.remove('hidden');
    }
  } else {
    fillRandomCell(field);
  }

  synchronizeCellsAndScore(field);
});

function moveUp(gameField, totalScore) {
  let innerScore = 0;

  function pushUp() {
    for (let j = 0; j < gameField.length; j++) {
      let position = 0;

      for (let i = 0; i < gameField[j].length; i++) {
        if (gameField[i][j] !== '') {
          const tmp = gameField[i][j];

          gameField[i][j] = gameField[position][j];
          gameField[position][j] = tmp;
          position++;
        }
      }
    }
  }

  function matchUp() {
    for (let j = 0; j < gameField.length; j++) {
      for (let i = 1; i < gameField[j].length; i++) {
        if (gameField[i][j] === gameField[i - 1][j]) {
          gameField[i - 1][j] += gameField[i][j];
          innerScore += +gameField[i - 1][j];
          gameField[i][j] = '';
        }
      }
    }
  }

  pushUp();
  matchUp();
  pushUp();

  return totalScore + innerScore;
}

function moveDown(gameField, totalScore) {
  let innerScore = 0;

  function pushDown() {
    for (let j = 0; j < gameField.length; j++) {
      let position = gameField[j].length - 1;

      for (let i = gameField[j].length - 1; i >= 0; i--) {
        if (gameField[i][j] !== '') {
          const tmp = gameField[i][j];

          gameField[i][j] = gameField[position][j];
          gameField[position][j] = tmp;
          position--;
        }
      }
    }
  }

  function matchDown() {
    for (let j = 0; j < gameField.length; j++) {
      for (let i = gameField[j].length - 1; i > 0; i--) {
        if (gameField[i][j] === gameField[i - 1][j]) {
          gameField[i - 1][j] += gameField[i][j];
          innerScore += +gameField[i - 1][j];
          gameField[i][j] = '';
        }
      }
    }
  }

  pushDown();
  matchDown();
  pushDown();

  return totalScore + innerScore;
}

function moveRight(gameField, totalScore) {
  let innerScore = 0;

  function pushRight() {
    for (let i = 0; i < gameField.length; i++) {
      let position = gameField[i].length - 1;

      for (let j = gameField[i].length - 1; j >= 0; j--) {
        if (gameField[i][j] !== '') {
          const tmp = gameField[i][j];

          gameField[i][j] = gameField[i][position];
          gameField[i][position] = tmp;
          position--;
        }
      }
    }
  }

  function matchRight() {
    for (let i = 0; i < gameField.length; i++) {
      for (let j = gameField[i].length - 1; j > 0; j--) {
        if (gameField[i][j] === gameField[i][j - 1]) {
          gameField[i][j - 1] += gameField[i][j];
          innerScore += +gameField[i][j - 1];
          gameField[i][j] = '';
        }
      }
    }
  }

  pushRight();
  matchRight();
  pushRight();

  return totalScore + innerScore;
}

function moveLeft(gameField, totalScore) {
  let innerScore = 0;

  function pushLeft() {
    for (let i = 0; i < gameField.length; i++) {
      let position = 0;

      for (let j = 0; j < gameField[i].length; j++) {
        if (gameField[i][j] !== '') {
          const tmp = gameField[i][j];

          gameField[i][j] = gameField[i][position];
          gameField[i][position] = tmp;
          position++;
        }
      }
    }
  }

  function matchLeft() {
    for (let i = 0; i < gameField.length; i++) {
      for (let j = 1; j < gameField[i].length; j++) {
        if (gameField[i][j] === gameField[i][j - 1]) {
          gameField[i][j - 1] += gameField[i][j];
          innerScore += +gameField[i][j - 1];
          gameField[i][j] = '';
        }
      }
    }
  }

  pushLeft();
  matchLeft();
  pushLeft();

  return totalScore + innerScore;
}

function createField() {
  const gameField
  = [['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', '']];

  fillRandomCell(gameField);
  fillRandomCell(gameField);
  synchronizeCellsAndScore(gameField);

  return gameField;
}

function fillRandomCell(gameField) {
  const randomRow = Math.floor(Math.random() * 4);
  const randomColumn = Math.floor(Math.random() * 4);

  if (gameField[randomRow][randomColumn] === '') {
    if (Math.random() < 0.9) {
      gameField[randomRow][randomColumn] = 2;
    } else {
      gameField[randomRow][randomColumn] = 4;
    }
  } else {
    fillRandomCell(gameField);
  }
}

function synchronizeCellsAndScore(gameField) {
  for (let i = 0; i < gameField.length; i++) {
    for (let j = 0; j < gameField[i].length; j++) {
      const plainPosition = i * 4 + j;

      cells[plainPosition].classList
        .remove(`field-cell--${cells[plainPosition].textContent}`);
      cells[plainPosition].textContent = gameField[i][j];

      if (gameField[i][j] !== '') {
        cells[plainPosition].classList
          .add(`field-cell--${cells[plainPosition].textContent}`);
      }
    }
  }

  gameScore.textContent = score;
}

function hasEmptyCell(gameField) {
  for (let i = 0; i < gameField.length; i++) {
    if (gameField[i].includes('')) {
      return true;
    }
  }

  return false;
}

function checkWin(gameField) {
  for (let i = 0; i < gameField.length; i++) {
    if (gameField[i].includes(2048)) {
      return true;
    }
  }

  return false;
}
