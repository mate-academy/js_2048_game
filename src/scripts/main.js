'use strict';

const startButton = document.querySelector('.button');
const gameField = document.querySelector('.game-field');
const rowsField = gameField.querySelectorAll('.field-row');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const score = document.querySelector('.game-score');

let newScore = 0;
let GAME_MESSAGE = 'start';

const field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const NUMBER_TWO = 2;
const NUMBER_FOUR = 4;

startButton.addEventListener('click', () => {
  startGame();
});

document.addEventListener('keydown', press => {
  move(press.key);
});

function firstGenerate() {
  const firstPlace = generatePlace();
  let secondPlace;

  while (true) {
    secondPlace = generatePlace();

    if (firstPlace !== secondPlace) {
      break;
    }
  }

  const firstNumber = generateNumber();
  const secondNumber = generateNumber();

  const firstRow = getRow(firstPlace);
  const firstCell = getCell(firstPlace);
  const secondRow = getRow(secondPlace);
  const secondCell = getCell(secondPlace);

  field[firstRow][firstCell] = firstNumber;
  field[secondRow][secondCell] = secondNumber;

  printGameField();
}

function generatePlace() {
  return Math.floor(Math.random() * 16);
}

function generateNumber() {
  return Math.round(Math.random() * 10) === 10
    ? NUMBER_FOUR
    : NUMBER_TWO;
}

function addNumber() {
  let newPlace;
  let newRow;
  let newCell;
  let checker = false;
  const newNumber = generateNumber();

  for (let i = 0; i < field[0].length; i++) {
    for (let j = 0; j < field.length; j++) {
      if (field[i][j] === 0) {
        checker = true;
      }
    }
  }

  if (checker) {
    while (true) {
      newPlace = generatePlace();
      newRow = getRow(newPlace);
      newCell = getCell(newPlace);

      if (field[newRow][newCell] === 0) {
        field[newRow][newCell] = newNumber;
        printGameField();

        break;
      }
    }
  }
}

function getRow(number) {
  return Math.floor(number / 4);
}

function getCell(number) {
  return number % 4;
}

function printGameField() {
  for (let i = 0; i < field[0].length; i++) {
    for (let j = 0; j < field.length; j++) {
      const cellsField = rowsField[i].querySelectorAll('.field-cell');

      cellsField[j].className = 'field-cell';

      if (field[i][j] !== 0) {
        cellsField[j].classList.add(`field-cell--${field[i][j]}`);
        cellsField[j].textContent = `${field[i][j]}`;
      } else {
        cellsField[j].textContent = '';
        cellsField[j].className = 'field-cell';
      }
    }
  }
}

function clearGameField() {
  for (let i = 0; i < field[0].length; i++) {
    for (let j = 0; j < field.length; j++) {
      field[i][j] = 0;

      const cellsField = rowsField[i].querySelectorAll('.field-cell');

      cellsField[j].className = 'field-cell';

      cellsField[j].textContent = '';
    }
  }
}

function startGame() {
  if (startButton.textContent === 'Start') {
    firstGenerate();
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  } else if (startButton.textContent === 'Restart') {
    clearGameField();
    firstGenerate();
    score.textContent = 0;
    newScore = 0;
  }

  GAME_MESSAGE = 'start';
  changeMessage(GAME_MESSAGE);
}

function changeMessage(message) {
  if (message === 'start') {
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  if (message === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (message === 'win') {
    messageWin.classList.remove('hidden');
  }
}

function move(direction) {
  let stopGame = false;

  if (GAME_MESSAGE === 'win') {
    return;
  }

  switch (direction) {
    case 'ArrowUp':
      stopGame = moveUp();
      break;

    case 'ArrowDown':
      stopGame = moveDown();
      break;

    case 'ArrowLeft':
      stopGame = moveLeft();
      break;

    case 'ArrowRight':
      stopGame = moveRight();
      break;
  }

  score.textContent = newScore;

  if (checkWin()) {
    endGame(true);
  }

  if (stopGame) {
    if (checkValidMoves()) {
      endGame(false);
    }
  }
}

function moveUp() {
  let getMove = false;

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[0].length; j++) {
      if (field[j][i] !== 0
        && j !== 0
        && field[j - 1][i] === 0) {
        field[j - 1][i] = field[j][i];
        field[j][i] = 0;
        j -= 2;

        getMove = true;
      } else if (j > 0
        && field[j][i] === field[j - 1][i]
        && field[j][i] !== 0) {
        field[j - 1][i] *= 2;
        field[j][i] = 0;
        newScore += field[j - 1][i];

        getMove = true;
      }
    }
  }

  if (getMove) {
    addNumber();

    return false;
  }

  return true;
}

function moveDown() {
  let getMove = false;

  for (let i = 0; i < field.length; i++) {
    for (let j = field[0].length - 1; j >= 0; j--) {
      if (field[j][i] !== 0
        && j !== field[0].length - 1
        && field[j + 1][i] === 0) {
        field[j + 1][i] = field[j][i];
        field[j][i] = 0;
        j += 2;

        getMove = true;
      } else if (j < field[0].length - 1
        && field[j][i] === field[j + 1][i]
        && field[j][i] !== 0) {
        field[j + 1][i] *= 2;
        field[j][i] = 0;
        newScore += field[j + 1][i];

        getMove = true;
      }
    }
  }

  if (getMove) {
    addNumber();

    return false;
  }

  return true;
}

function moveLeft() {
  let getMove = false;

  for (let i = 0; i < field[0].length; i++) {
    for (let j = 0; j < field.length; j++) {
      if (field[i][j] !== 0
        && j !== 0
        && field[i][j - 1] === 0) {
        field[i][j - 1] = field[i][j];
        field[i][j] = 0;
        j -= 2;

        getMove = true;
      } else if (field[i][j] === field[i][j - 1] && field[i][j] !== 0) {
        field[i][j - 1] *= 2;
        field[i][j] = 0;
        newScore += field[i][j - 1];

        getMove = true;
      }
    }
  }

  if (getMove) {
    addNumber();

    return false;
  }

  return true;
}

function moveRight() {
  let getMove = false;

  for (let i = 0; i < field[0].length; i++) {
    for (let j = field.length - 1; j >= 0; j--) {
      if (field[i][j] !== 0
        && j !== field.length - 1
        && field[i][j + 1] === 0) {
        field[i][j + 1] = field[i][j];
        field[i][j] = 0;
        j += 2;

        getMove = true;
      } else if (field[i][j] === field[i][j + 1] && field[i][j] !== 0) {
        field[i][j + 1] *= 2;
        field[i][j] = 0;
        newScore += field[i][j + 1];

        getMove = true;
      }
    }
  }

  if (getMove) {
    addNumber();

    return false;
  }

  return true;
}

function endGame(endWin) {
  if (endWin) {
    GAME_MESSAGE = 'win';
  } else {
    GAME_MESSAGE = 'lose';
  }

  changeMessage(GAME_MESSAGE);
}

function checkValidMoves() {
  for (let i = 0; i < field[0].length; i++) {
    for (let j = 0; j < field.length; j++) {
      if (field[i][j] === 0
        || field[i][j] === field[i][j + 1]
        || ((i >= 0 && i < field[0].length - 1)
          && field[i][j] === field[i + 1][j])) {
        return false;
      }
    }
  }

  return true;
}

function checkWin() {
  for (let i = 0; i < field[0].length; i++) {
    for (let j = 0; j < field.length; j++) {
      if (field[i][j] === 2048) {
        return true;
      }
    }
  }

  return false;
}
