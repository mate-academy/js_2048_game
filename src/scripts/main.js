'use strict';

const button = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');
const size = 4;
const cellsCount = 16;
let gameStarted = false;
let score = 0;
let win = false;
const addedNumber = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
let gameField = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

// click start, init table
button.addEventListener('click', e => {
  gameStarted = true;

  if (button.classList.contains('start')) {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    win = false;
    reset();
  }

  createNumber();
  renderTable();
});

// fill table and score
function renderTable() {
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

// create and add number to table
function createNumber() {
  const emptyCells = [];
  let allCellsZero = 0;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (gameField[row][col] === 0) {
        emptyCells.push([row, col]);
        allCellsZero++;
      }
    };
  };

  const firstNumberIndex = Math.floor(Math.random() * emptyCells.length);
  const firstCellXY = emptyCells[firstNumberIndex];

  if (allCellsZero === cellsCount) {
    emptyCells.splice(firstNumberIndex, 1);

    const secondNumberIndex = Math.floor(Math.random() * emptyCells.length);
    const secondCellXY = emptyCells[secondNumberIndex];

    gameField[firstCellXY[0]][firstCellXY[1]]
     = addedNumber[Math.floor(Math.random() * addedNumber.length)];

    gameField[secondCellXY[0]][secondCellXY[1]]
     = addedNumber[Math.floor(Math.random() * addedNumber.length)];
  } else {
    gameField[firstCellXY[0]][firstCellXY[1]]
     = addedNumber[Math.floor(Math.random() * addedNumber.length)];
  }
};

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

// keymove
document.addEventListener('keyup', (ev) => {
  if (!gameStarted) {
    return;
  }

  switch (ev.code) {
    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowDown':
      moveDown();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    default:
      break;
  }

  createNumber();
  renderTable();

  if (!possibleMoveCells()) {
    messageLose.classList.remove('hidden');
  }

  if (win) {
    messageWin.classList.remove('hidden');
  }
});

// left move cells
function moveLeft() {
  for (let i = 0; i < size; i++) {
    const rowValues = gameField[i].filter(cell => cell !== 0);

    for (let index = 0; index < rowValues.length; index++) {
      if (rowValues[index] === rowValues[index + 1]) {
        rowValues[index] *= 2;
        rowValues.splice(index + 1, 1);
        score += rowValues[index];

        if (rowValues[index] === 2048) {
          win = true;
        }
      }
    }

    for (let j = 0; j < size; j++) {
      gameField[i][j] = rowValues[j] || 0;
    }
  }
}

// move cells right
function moveRight() {
  gameField.forEach(row => row.reverse());
  moveLeft();
  gameField.forEach(row => row.reverse());
}

// move cells up
function moveUp() {
  rewindColumnToRow();
  moveLeft();
  rewindRowToColumn();
}

// move cells down
function moveDown() {
  rewindColumnToRow();
  moveRight();
  rewindRowToColumn();
}

// make row from column
function rewindColumnToRow() {
  const newArray = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newArray[i][j] = gameField[j][i];
    }
  }
  gameField = newArray;
}

// make column from row
function rewindRowToColumn() {
  const newArray = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newArray[j][i] = gameField[i][j];
    }
  }
  gameField = newArray;
}

// possible move cells in rows and columns
function possibleMoveCells() {
  let possibleMove = false;

  // check rows
  for (let i = 0; i < size; i++) {
    if (gameField[i].some(cell => cell === 0)
        || gameField[i].some((cell, j) => cell === gameField[i][j + 1])) {
      possibleMove = true;
    }
  }
  // check column
  rewindColumnToRow();

  for (let i = 0; i < size; i++) {
    if (gameField[i].some((cell, j) => cell === gameField[i][j + 1])) {
      possibleMove = true;
    }
  }
  rewindRowToColumn();

  return possibleMove;
}
