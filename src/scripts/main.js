'use strict';

const field = document.querySelector('tbody');
const button = document.querySelector('button');
const scoreGame = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

let state = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let newState;
let win = false;
let score = 0;
const fieldChilren = [...field.children];
const fieldMatrix = fieldChilren.map(row => [...row.children]);

button.addEventListener('click', getActionButton);
document.addEventListener('keydown', action);

function getActionButton() {
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

  addСoord();
  addСoord();
  addCell();
}

function addСoord() {
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

function addCell() {
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

  scoreGame.innerText = score;
}

function action(e) {
  newState = state;

  switch (e.key) {
    case 'ArrowLeft':
      left();
      break;
    case 'ArrowRight':
      right();
      break;
    case 'ArrowUp':
      up();
      break;
    case 'ArrowDown':
      down();
      break;
    default:
      return;
  }
  addСoord();
  addCell();

  for (let x = 0; x < state.length; x++) {
    for (let y = 0; y < state.length; y++) {
      if (newState[x][y] !== state[x][y]) {
        state = newState;
        addСoord();
        addCell();
      }
    }
  }

  if (win === true) {
    messageWin.classList.remove('hidden');

    return;
  };

  if (!gameLose()) {
    messageLose.classList.remove('hidden');

    return;
  };
}

function left() {
  if (!checkRows()) {
    return;
  }

  newState = newState.map(row => {
    const newRow = row.filter(cell => cell !== 0);

    newRow.forEach((cell, index) => {
      if (cell === newRow[index + 1]) {
        newRow[index] = cell * 2;
        newRow[index + 1] = 0;
        score += newRow[index];

        if (newRow[index] === 2048) {
          win = true;
        }
      }
    });

    return newRow.concat(Array(4 - newRow.length).fill(0));
  });
  state = newState;
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

function transformState() {
  newState = newState[0]
    .map((colom, colIndex) => newState.map(row => row[colIndex]));
  state = newState;
}

function up() {
  transformState();
  left();
  transformState();
}

function down() {
  transformState();
  right();
  transformState();
}

function gameLose() {
  if (checkRows()) {
    return true;
  }

  transformState();

  return checkRows();
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
