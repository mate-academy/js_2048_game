/* eslint-disable no-console */
'use strict';

const button = document.querySelector('.button');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const fieldRows = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');

const size = 4;
let score = 0;
let isWin = false;
let newGameField;
let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const move = (e) => {
  newGameField = [...gameField];

  switch (e.key) {
    case 'ArrowLeft':
      left(newGameField);
      break;

    case 'ArrowRight':
      right(newGameField);
      break;

    case 'ArrowDown':
      down(newGameField);
      break;

    case 'ArrowUp':
      up(newGameField);
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
};

button.addEventListener('click', () => {
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

function checkRows() {
  let hasDuplicates = false;

  newGameField.forEach((row) => {
    if (row.some((cell, index) => cell === 0 || cell === row[index + 1])) {
      hasDuplicates = true;
    }
  });

  return hasDuplicates;
}

function checkColumns() {
  let hasDuplicates = false;

  newGameField.forEach((row) => {
    row.forEach((cell, index) => {
      if (cell === row[index + 1]) {
        hasDuplicates = true;
      }
    });
  });

  return hasDuplicates;
}

function reverseRows() {
  newGameField.forEach((row) => row.reverse());
}

function transposeGameField() {
  newGameField = newGameField[0].map((x, colIndex) =>
    newGameField.map((row) => row[colIndex]),
  );
}

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

function isPosibleToMove() {
  if (checkRows()) {
    return true;
  }

  transposeGameField();

  return checkColumns();
}

const addNumber = () => {
  const [randomX, randomY] = findEmptyCell();

  gameField[randomX][randomY] = Math.random() < 0.9 ? 2 : 4;
};

const left = () => {
  if (!checkRows) {
    return;
  }

  newGameField = newGameField.map((row) => {
    const newRow = row.filter((cell) => cell !== 0);

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
};

const right = () => {
  if (!checkRows) {
    return;
  }

  reverseRows();
  left();
  reverseRows();
};

const down = () => {
  transposeGameField();
  right();
  transposeGameField();
};

const up = () => {
  transposeGameField();
  left();
  transposeGameField();
};

const render = () => {
  gameField.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const elem = fieldRows[rowIndex].children[colIndex];

      if (cell === 0) {
        elem.textContent = '';
        elem.className = 'field-cell';
      } else {
        elem.textContent = cell;
        elem.className = `field-cell field-cell--${cell}`;
      }
    });
  });

  gameScore.textContent = score;
};

const reset = () => {
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
