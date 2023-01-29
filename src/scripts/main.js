'use strict';

let score = 0;

let field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const startButton = document.querySelector('button');
const gameField = document.querySelectorAll('.field-row');
const cells = document.querySelectorAll('.field-cell');
const scoreVal = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

startButton.addEventListener('click', (hendlEvent) => {
  if (hendlEvent.target.textContent === 'Restart') {
    reset();

    field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    score = 0;
    scoreVal.textContent = 0;
  }

  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  getRandomCell();
  getRandomCell();
  render();

  document.addEventListener('keydown', moveCells);
});

function render() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (field[i][j]) {
        gameField[i].children[j].textContent = field[i][j];

        gameField[i].children[j].classList
          = `field-cell field-cell--${field[i][j]}`;
      }
    }
  }
}

function reset() {
  [...cells].forEach(cell => {
    cell.textContent = '';
    cell.classList = 'field-cell';
  });
}

function getRandomCell() {
  const num1 = Math.floor(Math.random() * 4);
  const num2 = Math.floor(Math.random() * 4);

  if (!field[num1][num2]) {
    field[num1][num2] = Math.random() > 0.9 ? 4 : 2;

    return;
  }

  getRandomCell();
}

function moveCells(keybordEvent) {
  reset();

  switch (keybordEvent.key) {
    case 'ArrowLeft':
      moveHorizont(false);
      break;

    case 'ArrowRight':
      moveHorizont(true);
      break;

    case 'ArrowUp':
      moveVertical(false);
      break;

    case 'ArrowDown':
      moveVertical(true);
      break;

    default:
      break;
  }

  getRandomCell();
  render();

  if (checkIsWin()) {
    checkIsWin();
  }

  if (checkIsLose()) {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keydown', moveCells);
  }

  scoreVal.textContent = score;
}

function moveHorizont(arg) {
  for (let i = 0; i < 4; i++) {
    let arr = clearEmpty(field[i]);

    if (arg) {
      arr.reverse();
    }

    if (arr.length > 1) {
      for (let j = 1; j < arr.length; j++) {
        if (arr[j - 1] === arr[j]) {
          arr[j - 1] *= 2;
          arr[j] = 0;
          score += arr[j - 1];
          clearEmpty(arr);
        }
      }

      arr = clearEmpty(arr);
    }

    while (arr.length !== 4) {
      arr.push(0);
    }

    if (arg) {
      arr.reverse();
    }

    field[i] = arr;
  }
}

function moveVertical(arg) {
  for (let i = 0; i < 4; i++) {
    let column = [];

    for (let j = 0; j < 4; j++) {
      column.push(field[j][i]);
    }

    let arr = clearEmpty(column);

    if (arg) {
      arr.reverse();
    }

    if (arr.length > 1) {
      for (let j = 1; j < arr.length; j++) {
        if (arr[j - 1] === arr[j]) {
          arr[j - 1] *= 2;
          arr[j] = 0;
          score += arr[j - 1];
        }
      }

      arr = clearEmpty(arr);
    }

    while (arr.length !== 4) {
      arr.push(0);
    }

    if (arg) {
      arr.reverse();
    }

    for (let j = 0; j < 4; j++) {
      field[j][i] = arr[j];
    }

    arr = [];
    column = [];
  }
}

function clearEmpty(arr) {
  const newArr = arr.filter(item => item !== 0);

  return newArr;
}

function checkIsWin() {
  field.forEach(rows => rows.forEach(cell => {
    if (cell === 2048) {
      messageWin.classList.remove('hidden');

      document.removeEventListener('keydown', moveCells);

      return true;
    }
  }));

  return false;
}

function checkIsLose() {
  let empty = 0;
  const res = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (field[i][j] === 0) {
        empty++;
      }

      if (field[i][j] !== field[i][j + 1] || field[i][j] !== field[j + 1][i]) {
        res.push(0);
      } else {
        res.push(1);
      }
    }
  }

  if (!empty && res.every(num => num === 0)) {
    return true;
  }

  return false;
}
