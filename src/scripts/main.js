'use strict';
class Cell {
  constructor() {
    this.value = 0;
  }
}

const buttonStart = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

buttonStart.addEventListener('click', () => {
  if (buttonStart.classList.contains('start')) {
    buttonStart.classList.remove('start');
  }
  buttonStart.classList.add('restart');
  buttonStart.innerHTML = 'Restart';
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  score = 0;
  start();
});

const keypress = (action) => {
  if (action.key === 'ArrowRight') {
    moveRight(field);
  }

  if (action.key === 'ArrowLeft') {
    moveLeft(field);
  }

  if (action.key === 'ArrowUp') {
    moveTop(field);
  }

  if (action.key === 'ArrowDown') {
    moveDown(field);
  }
};

window.addEventListener('keydown', keypress);

const INITIAL_NUMBER_OF_CELLS = 2;
const NUMBER_OF_CELLS_TO_ADD = 1;
let score = 0;

const field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// функція старту (або рестарту)
function start() {
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      field[i][j] = new Cell();
    }
  }

  addCells(INITIAL_NUMBER_OF_CELLS);
  rennder();
}

// функція генерує 2 або 4 з вірогідністю 90%
function getRandomNumber() {
  return (Math.random() <= 0.89) ? 2 : 4;
}

// функція генерує рандомне число від 0 до 3 для визначення колонки або рядка
function getRandomRowColumn() {
  return Math.floor(Math.random() * 4);
}

// функція створює масив значень для виконанння перевірки
// порівняння масивів після виконання здвигу
function getConcatField(gameField) {
  let result = [];

  for (let i = 0; i <= 3; i++) {
    result = result.concat(gameField[i].map((item) => item.value));
  }

  return result;
}

// функція для додавання клітинок 2 або 4 в масив
function addCells(numberOfCells) {
  let copyNumberOfCells = numberOfCells;

  for (let i = 0; i < copyNumberOfCells; i++) {
    const randomNumber = getRandomNumber();
    const randomRow = getRandomRowColumn();
    const randomColumn = getRandomRowColumn();

    if (field[randomRow][randomColumn].value !== 0) {
      copyNumberOfCells++;
      continue;
    } else {
      field[randomRow][randomColumn].value = randomNumber;
    }
  }
}

// функція зсуву вправо
function moveRight(gameField) {
  const oldField = getConcatField(field);

  for (let i = 0; i < gameField.length; i++) {
    if (gameField[i].every(cell => cell.value === 0)) {
      continue;
    }

    for (let k = 0; k <= 4; k++) {
      for (let j = gameField[i].length - 2; j >= 0; j--) {
        if (gameField[i][j].value === 0) {
          continue;
        }

        if (gameField[i][j + 1].value === 0) {
          gameField[i][j + 1].value = gameField[i][j].value;
          gameField[i][j].value = 0;
          continue;
        }

        if (gameField[i][j + 1].value === gameField[i][j].value
          && !gameField[i][j + 1].wasChaanged && !gameField[i][j].wasChaanged) {
          gameField[i][j + 1].value = gameField[i][j].value
          + gameField[i][j + 1].value;
          gameField[i][j].value = 0;
          gameField[i][j + 1].wasChaanged = 'yes';
          score += gameField[i][j + 1].value;
        }
      }
    }
  }

  checkLose();

  const newField = getConcatField(field);

  if (newField.every((item, index) => item === oldField[index])) {
    return;
  }

  if (newField.includes(0)) {
    addCells(NUMBER_OF_CELLS_TO_ADD);
  } else {
    return;
  }

  for (let i = 0; i < gameField.length; i++) {
    for (let j = 0; j < gameField[i].length; j++) {
      delete gameField[i][j].wasChaanged;
    }
  }
  rennder();
}

// функція зсуву вліво
function moveLeft(gameField) {
  const oldField = getConcatField(field);

  for (let i = 0; i < gameField.length; i++) {
    if (gameField[i].every(cell => cell.value === 0)) {
      continue;
    }

    for (let k = 0; k <= 4; k++) {
      for (let j = 1; j < gameField[i].length; j++) {
        if (gameField[i][j].value === 0) {
          continue;
        }

        if (gameField[i][j - 1].value === 0) {
          gameField[i][j - 1].value = gameField[i][j].value;
          gameField[i][j].value = 0;
          continue;
        }

        if (gameField[i][j - 1].value === gameField[i][j].value
            && !gameField[i][j - 1].wasChaanged
            && !gameField[i][j].wasChaanged) {
          gameField[i][j - 1].value = gameField[i][j].value
          + gameField[i][j - 1].value;
          gameField[i][j].value = 0;
          gameField[i][j - 1].wasChaanged = 'yes';
          score += gameField[i][j - 1].value;
        }
      }
    }
  }

  checkLose();

  const newField = getConcatField(field);

  if (newField.every((item, index) => item === oldField[index])) {
    return;
  }

  if (newField.includes(0)) {
    addCells(NUMBER_OF_CELLS_TO_ADD);
  } else {
    return;
  }

  for (let i = 0; i < gameField.length; i++) {
    for (let j = 0; j < gameField[i].length; j++) {
      delete gameField[i][j].wasChaanged;
    }
  }
  rennder();
}

// функція зсуву вгору
function moveTop(gameField) {
  const oldField = getConcatField(field);

  for (let k = 0; k <= 4; k++) {
    for (let i = 1; i < gameField.length; i++) {
      for (let j = 0; j < gameField[i].length; j++) {
        if (gameField[i][j].value === 0) {
          continue;
        }

        if (gameField[i - 1][j].value === 0) {
          gameField[i - 1][j].value = gameField[i][j].value;
          gameField[i][j].value = 0;
          continue;
        }

        if (gameField[i - 1][j].value === gameField[i][j].value
          && !gameField[i - 1][j].wasChaanged && !gameField[i][j].wasChaanged) {
          gameField[i - 1][j].value = gameField[i][j].value
          + gameField[i - 1][j].value;
          gameField[i][j].value = 0;
          gameField[i - 1][j].wasChaanged = 'yes';
          score += gameField[i - 1][j].value;
        }
      }
    }
  }

  checkLose();

  const newField = getConcatField(field);

  if (newField.every((item, index) => item === oldField[index])) {
    return;
  }

  if (newField.includes(0)) {
    addCells(NUMBER_OF_CELLS_TO_ADD);
  } else {
    return;
  }

  for (let i = 0; i < gameField.length; i++) {
    for (let j = 0; j < gameField[i].length; j++) {
      delete gameField[i][j].wasChaanged;
    }
  }
  rennder();
}

// функція зсуву вниз
function moveDown(gameField) {
  const oldField = getConcatField(field);

  for (let k = 0; k <= 4; k++) {
    for (let i = gameField.length - 2; i >= 0; i--) {
      for (let j = 0; j < gameField[i].length; j++) {
        if (gameField[i][j].value === 0) {
          continue;
        }

        if (gameField[i + 1][j].value === 0) {
          gameField[i + 1][j].value = gameField[i][j].value;
          gameField[i][j].value = 0;
          continue;
        }

        if (gameField[i + 1][j].value === gameField[i][j].value
          && !gameField[i + 1][j].wasChaanged && !gameField[i][j].wasChaanged) {
          gameField[i + 1][j].value = gameField[i][j].value
          + gameField[i + 1][j].value;
          gameField[i][j].value = 0;
          gameField[i + 1][j].wasChaanged = 'yes';
          score += gameField[i + 1][j].value;
        }
      }
    }
  }

  checkLose();

  const newField = getConcatField(field);

  if (newField.every((item, index) => item === oldField[index])) {
    return;
  }

  if (newField.includes(0)) {
    addCells(NUMBER_OF_CELLS_TO_ADD);
  } else {
    return;
  }

  for (let i = 0; i < gameField.length; i++) {
    for (let j = 0; j < gameField[i].length; j++) {
      delete gameField[i][j].wasChaanged;
    }
  }
  rennder();
}

function checkLose() {
  const check = [];

  for (let i = 0; i < field.length; i++) {
    for (let j = 1; j < field[i].length - 1; j++) {
      if (field[i][j].value === field[i][j - 1].value
        || field[i][j].value === field[i][j + 1].value
        || field[i][j].value === 0) {
        check.push(true);
      }
    }
  }

  for (let i = 1; i < field.length - 1; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j].value === field[i - 1][j].value
        || field[i][j].value === field[i + 1][j].value
        || field[i][j].value === 0) {
        check.push(true);
      }
    }
  }

  const checkWin = getConcatField(field);

  if (checkWin.some(item => item === 2048)) {
    messageWin.classList.remove('hidden');
  }

  if (check.length === 0) {
    messageLose.classList.remove('hidden');
  }
}

function rennder() {
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      const cell = document.getElementById(`${i}_${j}`);

      cell.classList = '';
      cell.classList.add('field-cell');

      if (field[i][j].value === 0) {
        cell.innerHTML = '';
      } else {
        cell.innerHTML = field[i][j].value;

        cell.classList.add(`field-cell--${field[i][j].value}`);
      }
    }
  }

  const gameScore = document.querySelector('.game-score');

  gameScore.innerHTML = score;
}
