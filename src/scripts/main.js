'use strict';

const button = document.querySelector('button');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const field = document.querySelector('tbody');
const scoreField = document.querySelector('.game-score');

let state = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let newState;
let isWin = false;
let score = 0;
const fieldMatrix = [...field.children].map(row => [...row.children]);

button.addEventListener('click', buttonHandler);
document.addEventListener('keydown', move);

function buttonHandler() {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    score = 0;
    messageLose.classList.toggle('hidden', true);
    messageWin.classList.toggle('hidden', true);
  }

  addTile();
  addTile();
  render();
}

function addTile() {
  const [y, x] = findEmptyCell();

  state[y][x] = randomNumber();
}

function findEmptyCell() {
  const emptyCells = [];

  state.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell === 0) {
        emptyCells.push([rowIndex, columnIndex]);
      }
    });
  });

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function randomNumber() {
  return Math.random() >= 0.9 ? 4 : 2;
}

function render() {
  state.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const elem = fieldMatrix[rowIndex][columnIndex];

      elem.classList = 'field-cell';

      if (cell === 0) {
        elem.innerText = '';
      } else {
        elem.innerText = cell;
        elem.classList.add(`field-cell--${cell}`);
      }
    });
  });

  scoreField.innerText = score;
}

function move(e) {
  newState = state;

  switch (e.key) {
    case 'ArrowLeft':
      left();
      break;

    case 'ArrowRight':
      right();
      break;

    case 'ArrowDown':
      down();
      break;

    case 'ArrowUp':
      up();
      break;

    default:
      return;
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (newState[i][j] !== state[i][j]) {
        state = newState;
        addTile();
        render();

        if (isWin) {
          messageWin.classList.remove('hidden');

          return;
        }

        if (!isPosibleToMove()) {
          messageLose.classList.remove('hidden');
        }

        return;
      }
    }
  }
}

function left() {
  if (!checkRows()) {
    return;
  }

  newState = newState.map(row => {
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

    return newRow.concat(Array(4 - newRow.length).fill(0));
  });
}

function reverseRows() {
  newState.forEach(row => row.reverse());
}

function right() {
  if (!checkRows()) {
    return;
  }

  reverseRows();
  left();
  reverseRows();
}

function transposeState() {
  newState = newState[0]
    .map((_, colIndex) => newState.map(row => row[colIndex]));
}

function up() {
  transposeState();
  left();
  transposeState();
}

function down() {
  transposeState();
  right();
  transposeState();
}

function isPosibleToMove() {
  if (checkRows()) {
    return true;
  }

  transposeState();

  return checkColumns();
}

function checkRows() {
  for (let i = 0; i < 4; i++) {
    if (newState[i].some(cell => cell === 0)
      || newState[i].some((cell, j) => cell === newState[i][j + 1])) {
      return true;
    }
  }

  return false;
}

function checkColumns() {
  for (let i = 0; i < 4; i++) {
    if (newState[i].some((cell, j) => cell === newState[i][j + 1])) {
      return true;
    }
  }

  return false;
}
