'use strict';

const page = document.documentElement;
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const table = document.querySelector('.game-field');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

// #region functions
const randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

const twoOrFour = function() {
  const randomNum = Math.floor(Math.random() * 10);

  if (randomNum === 4) {
    return 4;
  }

  return 2;
};

const randomNew = function() {
  let count = 0;

  for (let row = 0; row < field.length; row++) {
    if (field[row].some(cell => cell === 0)) {
      count++;
    }
  }

  if (count === 0) {
    return;
  }

  let found = false;

  while (!found) {
    const randomRow = randomInt(0, 4);
    const randomCell = randomInt(0, 4);

    if (field[randomRow][randomCell] === 0) {
      field[randomRow][randomCell] = twoOrFour();
      found = true;
    }
  }

  pageRefresh();
};

const pageRefresh = function() {
  for (let row = 0; row < field.length; row++) {
    for (let cell = 0; cell < field[row].length; cell++) {
      if (table.rows[row].cells[cell] !== field[row][cell]) {
        table.rows[row].cells[cell].className = '';
        table.rows[row].cells[cell].classList.add('field-cell');

        table.rows[row].cells[cell]
          .classList.add(`field-cell--${field[row][cell]}`);
        table.rows[row].cells[cell].textContent = field[row][cell] || '';
      }
    }
  }

  score.textContent = scoreCounter;
};

const filterZero = function(row) {
  return row.filter(cell => cell !== 0);
};

const moving = function(row) {
  let movedRow = filterZero(row);

  for (let cell = 0; cell < movedRow.length - 1; cell++) {
    if (movedRow[cell] === movedRow[cell + 1]) {
      movedRow[cell] *= 2;
      scoreCounter += movedRow[cell];
      movedRow[cell + 1] = 0;
    }
  }

  movedRow = filterZero(movedRow);

  while (movedRow.length < row.length) {
    movedRow.push(0);
  }

  return movedRow;
};

const moveLeft = function() {
  for (let row = 0; row < field.length; row++) {
    field[row] = moving(field[row]);
  }
};

const moveRight = function() {
  for (let row = 0; row < field.length; row++) {
    field[row] = moving(field[row].reverse()).reverse();
  }
};

const moveUp = function() {
  for (let cell = 0; cell < field.length; cell++) {
    let newRow = [
      field[0][cell],
      field[1][cell],
      field[2][cell],
      field[3][cell],
    ];

    newRow = moving(newRow);
    field[0][cell] = newRow[0];
    field[1][cell] = newRow[1];
    field[2][cell] = newRow[2];
    field[3][cell] = newRow[3];
  }
};

const moveDown = function() {
  for (let cell = 0; cell < field.length; cell++) {
    let newRow = [
      field[3][cell],
      field[2][cell],
      field[1][cell],
      field[0][cell],
    ];

    newRow = moving(newRow);
    field[0][cell] = newRow[3];
    field[1][cell] = newRow[2];
    field[2][cell] = newRow[1];
    field[3][cell] = newRow[0];
  }
};

const winCheck = function() {
  for (let row = 0; row < field.length; row++) {
    for (let cell = 0; cell < field[row].length; cell++) {
      if (field[row][cell] === 2024) {
        return true;
      }
    }
  }

  return false;
};

const loseCheck = function() {
  for (let row = 0; row < field.length; row++) {
    for (let cell = 0; cell < field[row].length; cell++) {
      if (field[row][cell] === 0) {
        return false;
      };

      let checkUp, checkDown, checkRight, checkLeft;

      if (field[row + 1]) {
        checkUp = field[row][cell] === field[row + 1][cell];
      }

      if (field[row - 1]) {
        checkDown = field[row][cell] === field[row - 1][cell];
      }

      if (field[row][cell + 1]) {
        checkRight = field[row][cell] === field[row][cell + 1];
      }

      if (field[row][cell - 1]) {
        checkLeft = field[row][cell] === field[row][cell - 1];
      }

      if (checkUp || checkDown || checkRight || checkLeft) {
        return false;
      }
    }
  }

  return true;
};
// #endregion
// #region interactivePage
let field;
let scoreCounter = 0;

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');
  }

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  button.classList.remove('restart.active');

  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  randomNew();
  randomNew();
});

page.addEventListener('keydown', (eve) => {
  eve.preventDefault();

  switch (eve.key) {
    case 'ArrowUp': {
      moveUp();
      break;
    }

    case 'ArrowDown': {
      moveDown();
      break;
    }

    case 'ArrowLeft': {
      moveLeft();
      break;
    }

    case 'ArrowRight': {
      moveRight();
      break;
    }
  }

  randomNew();
  pageRefresh();

  if (loseCheck()) {
    messageLose.classList.remove('hidden');
    button.classList.add('restart__active');
  }

  if (winCheck()) {
    messageWin.classList.remove('hidden');
  }
});
// #endregion
