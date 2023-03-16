'use strict';

const buttonAction = document.querySelector('.button');
const messages = document.querySelectorAll('.message');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');
const fieldLength = 4;
const up = 'ArrowUp';
const down = 'ArrowDown';
const left = 'ArrowLeft';
const right = 'ArrowRight';
let winning;
let score;
let field;

buttonAction.addEventListener('click', () => {
  score = 0;
  winning = false;

  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  addNewNumber();
  addNewNumber();

  allMessagesHidden();

  buttonAction.innerHTML = 'Reset';
  buttonAction.classList.remove('start');
  buttonAction.classList.add('restart');

  render();
});

function addNewNumber() {
  if (includesZero()) {
    let row = field[randomNumber(4)];
    const zeroIndex = row.indexOf(0);

    if (zeroIndex !== -1) {
      const allIndexZero = row.reduce((acc, el, i) => {
        if (el === 0) {
          acc.push(i);
        }

        return acc;
      }, []);

      const randomZero = allIndexZero[randomNumber(allIndexZero.length)];
      const rowIndex = field.indexOf(row);

      field[rowIndex][randomZero] = randomNumber();
    } else {
      row = field[randomNumber(4)];
    }
  }
}

function randomNumber(max) {
  if (!max) {
    return Math.random() < 0.2 ? 4 : 2;
  }

  return Math.floor(Math.random() * max);
}

function render() {
  const cell = document.querySelectorAll('.field-cell');

  gameScore.innerHTML = score;

  if (winning) {
    messageWin.classList.remove('hidden');
  }

  if (!includesZero() && isGameOver()) {
    messageLose.classList.remove('hidden');
  }

  for (let i = 0; i < fieldLength; i++) {
    for (let j = 0; j < fieldLength; j++) {
      const index = i * fieldLength + j;

      if (field[i][j] !== 0) {
        cell[index].innerHTML = field[i][j];
        cell[index].className = `field-cell field-cell--${field[i][j]}`;
      } else {
        cell[index].innerHTML = '';
        cell[index].className = 'field-cell';
      }
    }
  }
}

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case up:
      moveUp();
      break;

    case down:
      moveDown();
      break;

    case left:
      moveLeft();
      break;

    case right:
      moveRight();
      break;

    default:
      break;
  }
});

function moveLeft() {
  for (let i = 0; i < fieldLength; i++) {
    let row = filterZero(field[i]);

    addZeros(row);

    summationNumbers(row);

    row = filterZero(row);

    addZeros(row);

    field[i] = row;
  }

  addNewNumber();
  render();
};

function moveRight() {
  for (let i = 0; i < fieldLength; i++) {
    let row = filterZero(field[i]);

    addZeros(row, 'reverse');

    summationNumbers(row, 'reverse');

    row = filterZero(row);

    addZeros(row, 'reverse');

    field[i] = row;
  }

  addNewNumber();
  render();
};

function moveUp() {
  for (let i = 0; i < fieldLength; i++) {
    let column = [];

    for (let j = 0; j < fieldLength; j++) {
      column.push(field[j][i]);
    }

    column = filterZero(column);

    addZeros(column);

    summationNumbers(column);

    column = filterZero(column);

    addZeros(column);

    for (let l = 0; l < fieldLength; l++) {
      field[l][i] = column[l];
    }
  }

  addNewNumber();
  render();
};

function moveDown() {
  for (let i = 0; i < fieldLength; i++) {
    let column = [];

    for (let j = 0; j < fieldLength; j++) {
      column.push(field[j][i]);
    }

    column = filterZero(column);

    addZeros(column, 'reverse');

    summationNumbers(column, 'reverse');

    column = filterZero(column);

    addZeros(column, 'reverse');

    for (let l = 0; l < fieldLength; l++) {
      field[l][i] = column[l];
    }
  }

  addNewNumber();
  render();
};

function filterZero(arr) {
  return arr.filter(num => num !== 0);
}

function addZeros(arr, reverse) {
  if (reverse) {
    while (arr.length < 4) {
      arr.unshift(0);
    }
  } else {
    while (arr.length < 4) {
      arr.push(0);
    }
  }
}

function summationNumbers(arr, reverse) {
  if (reverse) {
    for (let i = fieldLength - 1; i >= 0; i--) {
      if (arr[i] === arr[i - 1] && arr[i] !== 0) {
        arr[i] += arr[i - 1];
        isWinning(arr[i]);
        arr[i - 1] = 0;
        score += arr[i];
      }
    }
  } else {
    for (let i = 0; i < fieldLength - 1; i++) {
      if (arr[i] === arr[i + 1] && arr[i] !== 0) {
        arr[i] += arr[i + 1];
        isWinning(arr[i]);
        arr[i + 1] = 0;
        score += arr[i];
      }
    }
  }
}

function allMessagesHidden() {
  messages.forEach(message => message.classList.add('hidden'));
}

function includesZero() {
  let haveZero = false;

  for (let i = 0; i < fieldLength; i++) {
    if (field[i].includes(0)) {
      haveZero = true;
      break;
    }
  }

  return haveZero;
}

function isGameOver() {
  for (let i = 0; i < fieldLength; i++) {
    for (let j = 0; j < fieldLength - 1; j++) {
      if (field[i][j] === field[i][j + 1]) {
        return false;
      }
    }
  }

  for (let i = 0; i < fieldLength - 1; i++) {
    for (let j = 0; j < fieldLength; j++) {
      if (field[i][j] === field[i + 1][j]) {
        return false;
      }
    }
  }

  return true;
}

function isWinning(number) {
  if (number === 2048) {
    winning = true;
  }
};
