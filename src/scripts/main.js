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
let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

button.addEventListener('click', (e) => {
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

function move(e) {
  newGameField = [...gameField];

  const leftArrow = 'ArrowLeft';
  const rightArrow = 'ArrowRight';
  const downArrow = 'ArrowDown';
  const upArrow = 'ArrowUp';

  switch (e.key) {
    case leftArrow:
      left(newGameField);
      break;

    case rightArrow:
      right(newGameField);
      break;

    case downArrow:
      down(newGameField);
      break;

    case upArrow:
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

  if (!isPossibleToMove()) {
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
}

function addNumber() {
  const [randomY, randomX] = findEmptyCell();

  gameField[randomY][randomX] = Math.random() < 0.8 ? 2 : 4;
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

function render() {
  gameField.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const element = fieldRows[rowIndex].children[columnIndex];

      if (cell === 0) {
        element.textContent = '';
        element.className = 'field-cell';
      } else {
        element.textContent = cell;
        element.className = `field-cell field-cell--${cell}`;
        element.style.top = '0px';
        element.style.left = '0px';
      }

      setTimeout(() => {
        element.style.top = '100px';
        element.style.left = '100px';
      }, 300);
    });
  });

  gameScore.textContent = score;
}

function left() {
  if (!checkRows()) {
    return;
  }

  newGameField = newGameField.map((row) => {
    const newRow = row.filter((cell) => cell !== 0);

    newRow.forEach((cell, i) => {
      if (cell === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow.splice(i + 1, 1);
        score += newRow[i];

        if (newRow[i] === 2048) {
          isWin = true;
        }
      }
    });

    return newRow.concat(Array(size - newRow.length).fill(0));
  });
}

function right() {
  if (!checkRows()) {
    return;
  }

  reverseRows();
  left();
  reverseRows();
}

function reverseRows() {
  newGameField.forEach((row) => row.reverse());
}

function down() {
  transposeGameField();
  right();
  transposeGameField();
}

function up() {
  transposeGameField();
  left();
  transposeGameField();
}

function transposeGameField() {
  newGameField = newGameField[0].map((el, colIndex) =>
    newGameField.map((row) => row[colIndex]),
  );
}

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

function isPossibleToMove() {
  if (checkRows()) {
    return true;
  }

  transposeGameField();

  return checkColumns();
}
