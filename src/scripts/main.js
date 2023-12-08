'use strict';

let valueBoard;
const rows = 4;
const columns = 4;
let score = 0;

const buttonStart = document.querySelector('.start');
const fieldRows = document.querySelectorAll('tr');
const cells = document.querySelectorAll('td');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const board = [];

[...fieldRows].forEach(row => {
  const cell = row.querySelectorAll('td');

  board.push(cell);
});

function setGame() {
  valueBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  addNumber();
  addNumber();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rows; j++) {
      const number = valueBoard[i][j];

      updateCell(board[i][j], number);
    }
  }
}

function updateCell(cell, num) {
  cell.classList.value = `field-cell`;

  if (num > 0) {
    cell.textContent = num;
    cell.classList.add(`field-cell--${num}`);
  } else if (num === 0) {
    cell.textContent = '';
  }
}

function createRandomNumber(num) {
  return Math.floor(Math.random() * num);
}

function addNumber() {
  if (!hasEmptyCell()) {
    return;
  }

  let activeCell = false;

  while (!activeCell) {
    const r = createRandomNumber(rows);
    const c = createRandomNumber(columns);

    if (valueBoard[r][c] === 0) {
      const num = Math.random() <= 0.1 ? 4 : 2;

      valueBoard[r][c] = num;
      board[r][c].textContent = num;
      board[r][c].classList.add(`field-cell--${num}`);
      activeCell = true;
    }
  }
};

function hasEmptyCell() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (valueBoard[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
};

document.addEventListener('click', (ev) => {
  ev.preventDefault();

  if (ev.target.closest('.start')) {
    messageStart.classList.add(`hidden`);
    buttonStart.textContent = 'Restart';
    buttonStart.classList.add(`restart`);
    buttonStart.classList.remove(`start`);
    setGame();
    document.addEventListener('keydown', playGame);
  } else if (ev.target.closest('.restart')) {
    setGame();
    score = 0;
  }
});

function hasAdjacentSameNumbers(data) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (i < rows - 1 && data[i][j] === data[i + 1][j]) {
        return true;
      } else if (j < columns - 1 && data[i][j] === data[i][j + 1]) {
        return true;
      }
    }
  }

  return false;
}

function filterZero(data) {
  const newRow = data.filter(num => num !== 0);

  return newRow;
}

function move(data) {
  let flag = false;
  let row = filterZero(data);
  const rowStart = data;

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      flag = true;
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  row = filterZero(row);

  while (row.length < columns) {
    row.push(0);
  }

  if (rowStart.toString() !== row.toString()) {
    flag = true;
  }

  return [row, flag];
}

function hasActions(actions) {
  if (actions.includes(true)) {
    addNumber();
  }
}

function moveLeft() {
  const actions = [];
  let flag;

  for (let r = 0; r < rows; r++) {
    let row = valueBoard[r];

    [row, flag] = move(row);
    actions.push(flag);
    valueBoard[r] = row;

    for (let c = 0; c < columns; c++) {
      const number = valueBoard[r][c];

      updateCell(board[r][c], number);
    }
  }

  hasActions(actions);
  checkLose();
  checkWin();
};

function moveRight() {
  const actions = [];
  let flag;

  for (let r = 0; r < rows; r++) {
    let row = valueBoard[r];

    row.reverse();
    [row, flag] = move(row);
    actions.push(flag);
    valueBoard[r] = row.reverse(); ;

    for (let c = 0; c < columns; c++) {
      const number = valueBoard[r][c];

      updateCell(board[r][c], number);
    }
  }
  hasActions(actions);
  checkLose();
  checkWin();
};

function moveUp() {
  const actions = [];
  let flag;

  for (let c = 0; c < columns; c++) {
    let column = [valueBoard[0][c], valueBoard[1][c],
      valueBoard[2][c], valueBoard[3][c]];

    [column, flag] = move(column);
    actions.push(flag);

    for (let r = 0; r < columns; r++) {
      valueBoard[r][c] = column[r];

      const number = valueBoard[r][c];

      updateCell(board[r][c], number);
    }
  }

  hasActions(actions);
  checkLose();
  checkWin();
}

function moveDown() {
  const actions = [];
  let flag;

  for (let c = 0; c < columns; c++) {
    let column = [valueBoard[3][c], valueBoard[2][c],
      valueBoard[1][c], valueBoard[0][c]];

    [column, flag] = move(column);
    actions.push(flag);

    column.reverse();

    for (let r = 0; r < columns; r++) {
      valueBoard[r][c] = column[r];

      const number = valueBoard[r][c];

      updateCell(board[r][c], number);
    }
  }
  hasActions(actions);
  checkLose();
  checkWin();
}

function checkWin() {
  [...cells].forEach(cell => {
    if (cell.textContent === '2048') {
      messageWin.classList.remove(`hidden`);
      document.removeEventListener('keydown', playGame);

      setTimeout(() => {
        document.location.reload();
      }, 5000);
    }
  });
}

function checkLose() {
  if (!hasEmptyCell() && !hasAdjacentSameNumbers(valueBoard)) {
    messageLose.classList.remove(`hidden`);
  }
}

function playGame(e) {
  e.preventDefault();

  switch (e.key) {
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowUp':
      moveUp();
      break;
  }

  document.querySelector('.game-score').textContent = score;
}
