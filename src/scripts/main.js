'use strict';

const button = document.querySelector('button');

const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

const field = document.querySelector('tbody');
const gameScore = document.querySelector('.game-score');

let initialState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let newState = 0;
let isWinner = false;
let score = 0;

const fieldMarking = [...field.children].map(row => [...row.children]);

button.addEventListener('click', buttonHandler);
document.addEventListener('keyup', move);

function buttonHandler() {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';
    startMessage.classList.add('hidden');
  } else {
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    score = 0;
    loseMessage.classList.toggle('hidden', true);
    winMessage.classList.toggle('hidden', true);
  }

  addTile();
  addTile();
  render();
}

function addTile() {
  const [y, x] = emptyCell();

  initialState[y][x] = number();
}

function emptyCell() {
  const emptyCells = [];

  initialState.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell === 0) {
        emptyCells.push([rowIndex, columnIndex]);
      }
    });
  });

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

function number() {
  return Math.random() >= 0.9 ? 4 : 2;
};

function render() {
  initialState.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const elem = fieldMarking[rowIndex][columnIndex];

      elem.classList = 'field-cell';

      if (cell === 0) {
        elem.innerText = '';
      } else {
        elem.innerText = cell;
        elem.classList.add(`field-cell--${cell}`);
      }
    });
  });

  gameScore.innerText = score;
}

function move(e) {
  newState = initialState;

  const { key } = e;

  switch (key) {
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
      if (newState[i][j] !== initialState[i][j]) {
        initialState = newState;
        addTile();
        render();

        if (isWinner) {
          winMessage.classList.remove('hidden');

          return;
        }

        if (!isCanMove()) {
          loseMessage.classList.remove('hidden');
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
          isWinner = true;
        }
      }
    });

    return newRow.concat(Array(4 - newRow.length).fill(0));
  });
};

function reversRows() {
  newState.forEach(row => row.reverse());
}

function right() {
  if (!checkRows()) {
    return;
  }

  reversRows();
  left();
  reversRows();
}

function tarnsporteState() {
  newState = newState[0]
    .map((_, columnIndex) => newState
      .map(row => row[columnIndex]));
}

function up() {
  tarnsporteState();
  left();
  tarnsporteState();
}

function down() {
  tarnsporteState();
  right();
  tarnsporteState();
}

function isCanMove() {
  if (checkRows()) {
    return true;
  }

  tarnsporteState();

  return checkColumns();
};

function checkRows() {
  return newState.some(row =>
    row.some((cell, index) =>
      cell === 0 || cell === row[index + 1]
    )
  );
}

function checkColumns() {
  return newState.some((column, i) => {
    return column.some((cell, j) => {
      return newState[j + 1][i] === cell;
    });
  });
}
