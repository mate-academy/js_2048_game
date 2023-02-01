'use strict';

const button = document.querySelector('.button');
const currentScore = document.querySelector('.game-score');
const fieldRow = document.querySelectorAll('.field-row');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const size = 4;

let score = 0;
let isWinner = false;
let newField;
let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

button.addEventListener('click', e => {
  document.addEventListener('keydown', move);

  if (button.innerText === 'Start') {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    isWinner = false;
    reset();
  }

  addNewNumber();
  addNewNumber();
  render();
});

function reset() {
  score = 0;

  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  if (!messageLose.classList.contains('hidden')) {
    messageLose.classList.add('hidden');
  }

  if (!messageWin.classList.contains('hidden')) {
    messageWin.classList.add('hidden');
  }
};

function render() {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const item = fieldRow[row].children[col];
      const cell = gameField[row][col];

      if (cell === 0) {
        item.textContent = '';
        item.className = 'field-cell';
      } else {
        item.textContent = cell;
        item.className = `field-cell field-cell--${cell}`;
      }
    };
  };

  currentScore.textContent = score;
};

function addNewNumber() {
  const [randomColumn, randomRow] = findEmptyCell();

  gameField[randomColumn][randomRow] = Math.random() < 0.9 ? 2 : 4;
};

function findEmptyCell() {
  const emptyCells = [];

  gameField.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell === 0) {
        emptyCells.push([rowIndex, columnIndex]);
      }
    });
  });

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

function move(e) {
  newField = gameField;

  switch (e.key) {
    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowDown':
      moveDown();
      break;

    case 'ArrowUp':
      moveUp();
      break;

    default:
      return;
  }

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (newField[row][col] !== gameField[row][col]) {
        gameField = newField;
        addNewNumber();
        render();
      }
    }
  }

  if (isWinner) {
    messageWin.classList.remove('hidden');
  }

  if (!canMove()) {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keydown', move);
  }
};

function moveLeft() {
  if (!checkRows()) {
    return;
  }

  newField = newField.map(row => {
    const newRow = row.filter(cell => cell !== 0);

    newRow.forEach((cell, index) => {
      if (cell === newRow[index + 1]) {
        newRow[index] *= 2;
        newRow.splice(index + 1, 1);
        score += newRow[index];

        if (newRow[index] === 2048) {
          isWinner = true;
        }
      }
    });

    return newRow.concat(Array(size - newRow.length).fill(0));
  });
};

function moveRight() {
  if (!checkRows()) {
    return;
  }

  toReverse();
  moveLeft();
  toReverse();
};

function moveDown() {
  toTranspose();
  moveRight();
  toTranspose();
};

function moveUp() {
  toTranspose();
  moveLeft();
  toTranspose();
};

function toTranspose() {
  newField = newField[0]
    .map((_, colIndex) => newField.map(row => row[colIndex]));
};

function toReverse() {
  newField.forEach(row => row.reverse());
};

function canMove() {
  if (checkRows()) {
    return true;
  }

  toTranspose();

  return checkColumns();
};

function checkRows() {
  for (let i = 0; i < size; i++) {
    if (newField[i].some(cell => cell === 0)
      || newField[i].some((cell, j) => cell === newField[i][j + 1])) {
      return true;
    }
  }

  return false;
};

function checkColumns() {
  for (let i = 0; i < size; i++) {
    if (newField[i].some((cell, j) => cell === newField[i][j + 1])) {
      return true;
    }
  }

  return false;
};
