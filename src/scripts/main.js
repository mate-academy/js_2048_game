'use strict';

const button = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');
const size = 4;
let score = 0;
let isWin = false;
let newGameField;
const DIRECTION_LEFT = 'ArrowLeft';
const DIRECTION_RIGHT = 'ArrowRight';
const DIRECTION_DOWN = 'ArrowDown';
const DIRECTION_UP = 'ArrowUp';
let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

button.addEventListener('click', e => {
  document.addEventListener('keydown', move);

  if (button.classList.contains('start')) {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    isWin = false;
    reset();
  }

  addNumber();
  addNumber();
  render();
});

function move(element) {
  newGameField = gameField;

  switch (element.key) {
    case DIRECTION_LEFT:
      goLeft();
      break;

    case DIRECTION_RIGHT:
      goRight();
      break;

    case DIRECTION_DOWN:
      goDown();
      break;

    case DIRECTION_UP:
      goUp();
      break;

    default:
      return;
  }

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (newGameField[row][col] !== gameField[row][col]) {
        gameField = newGameField;
        addNumber();
        render();
      }
    }
  }

  if (isWin) {
    messageWin.classList.remove('hidden');
  }

  if (!isPosibleToMove()) {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keydown', move);
  }
}

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

function addNumber() {
  const [randomY, randomX] = findEmptyCell();

  gameField[randomY][randomX] = Math.random() < 0.9 ? 2 : 4;
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
}

function render() {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const elem = fieldRows[row].children[col];
      const cell = gameField[row][col];

      if (cell === 0) {
        elem.textContent = '';
        elem.className = 'field-cell';
      } else {
        elem.textContent = cell;
        elem.className = `field-cell field-cell--${cell}`;
      }
    };
  };

  gameScore.textContent = score;
};

function goLeft() {
  if (!checkRows()) {
    return;
  }

  newGameField = newGameField.map(row => {
    const newRow = row.filter(cell => cell !== 0);

    newRow.forEach((cell, index) => {
      if (cell === newRow[index + 1]) {
        newRow[index] *= 2;
        newRow.splice(index + 1, 1);
        score += newRow[index];

        if (newRow[index] === 2048) {
          isWin = true;
        }
      }
    });

    return newRow.concat(Array(size - newRow.length).fill(0));
  });
}

function goRight() {
  if (!checkRows()) {
    return;
  }

  reverseRows();
  goLeft();
  reverseRows();
}

function reverseRows() {
  newGameField.forEach(row => row.reverse());
}

function goDown() {
  transposeGameField();
  goRight();
  transposeGameField();
}

function goUp() {
  transposeGameField();
  goLeft();
  transposeGameField();
}

function transposeGameField() {
  newGameField = newGameField[0]
    .map((_, colIndex) => newGameField.map(row => row[colIndex]));
}

function isPosibleToMove() {
  if (checkRows()) {
    return true;
  }

  transposeGameField();

  return checkColumns();
}

function checkRows() {
  for (let i = 0; i < size; i++) {
    if (newGameField[i].some(cell => cell === 0)
      || newGameField[i].some((cell, j) => cell === newGameField[i][j + 1])) {
      return true;
    }
  }

  return false;
}

function checkColumns() {
  for (let i = 0; i < size; i++) {
    if (newGameField[i].some((cell, j) => cell === newGameField[i][j + 1])) {
      return true;
    }
  }

  return false;
}
