'use strict';

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let probabilityCount = 0;
let score = 0;
let started = false;

const body = document.querySelector('body');
const fieldRowAll = body.querySelectorAll('.field-row');
const start = body.querySelector('.start');
const scoreDisplay = body.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function newCell() {
  if (!freeCell()) {
    if (ifLose()) {
      messageLose.classList.remove('hidden');
    }

    return;
  }

  let rowInd = 0;
  let cellInd = 0;

  while (true) {
    rowInd = getRandomInt(4);
    cellInd = getRandomInt(4);

    if (board[rowInd][cellInd] === 0) {
      if (probabilityCount < 10) {
        board[rowInd][cellInd] = 2;
        probabilityCount++;
      } else {
        board[rowInd][cellInd] = 4;
        probabilityCount = 0;
      }

      return;
    }
  }
};

function shiftRowLeft(row) {
  const newRow = [];

  for (let j = 0; j < row.length; j++) {
    if (row[j] !== 0) {
      newRow.push(row[j]);
    }
  }

  for (let j = newRow.length; j < row.length; j++) {
    newRow.push(0);
  }

  return newRow;
}

function moveRight() {
  for (let i = 0; i < board.length; i++) {
    board[i] = shiftRowLeft(board[i]).reverse();
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 1; j < board[i].length; j++) {
      if (board[i][j - 1] === board[i][j]) {
        board[i][j - 1] = 0;
        board[i][j] = board[i][j] * 2;
        score += board[i][j];
      }
    }
  }

  for (let i = 0; i < board.length; i++) {
    board[i] = shiftRowLeft(board[i]).reverse();
  }
}

function moveLeft() {
  for (let i = 0; i < board.length; i++) {
    board[i] = shiftRowLeft(board[i]);
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 1; j < board[i].length; j++) {
      if (board[i][j - 1] === board[i][j]) {
        board[i][j - 1] = board[i][j - 1] * 2;
        board[i][j] = 0;
        score += board[i][j - 1];
      }
    }
  }

  for (let i = 0; i < board.length; i++) {
    board[i] = shiftRowLeft(board[i]);
  }
}

function moveUp() {
  for (let i = 0; i < board.length; i++) {
    let newColumn = [];

    for (let j = 0; j < board[0].length; j++) {
      newColumn.push(board[j][i]);
    }

    newColumn = shiftRowLeft(newColumn);

    for (let j = 1; j < newColumn.length; j++) {
      if (newColumn[j - 1] === newColumn[j]) {
        newColumn[j - 1] = newColumn[j - 1] * 2;
        newColumn[j] = 0;
        score += newColumn[j - 1];
      }
    }

    newColumn = shiftRowLeft(newColumn);

    for (let j = 0; j < newColumn.length; j++) {
      board[j][i] = newColumn[j];
    }
  }
}

function moveDown() {
  for (let i = 0; i < board.length; i++) {
    let newColumn = [];

    for (let j = 0; j < board[0].length; j++) {
      newColumn.push(board[j][i]);
    }

    newColumn = shiftRowLeft(newColumn).reverse();

    for (let j = 1; j < newColumn.length; j++) {
      if (newColumn[j - 1] === newColumn[j]) {
        newColumn[j - 1] = 0;
        newColumn[j] = newColumn[j] * 2;
        score += newColumn[j];
      }
    }

    newColumn = shiftRowLeft(newColumn).reverse();

    for (let j = 0; j < newColumn.length; j++) {
      board[j][i] = newColumn[j];
    }
  }
}

function changeAdditionalClassCell(element, newAddClass) {
  element.classList = '';
  element.classList.add('field-cell');

  if (newAddClass) {
    element.classList.add(newAddClass);
  }
}

function ifWin() {
  for (const row of board) {
    for (const cell of row) {
      if (cell === 2048) {
        messageWin.classList.remove('hidden');
        start.textContent = 'Start';
        start.classList.remove('restart');
        start.classList.add('start');
        started = false;
        messageStart.classList.remove('hidden');
      }
    }
  }
}

function freeCell() {
  for (const row of board) {
    for (const cell of row) {
      if (cell === 0) {
        return true;
      }
    }
  }

  return false;
}

function ifLose() {
  let lose = true;
  const temp = [...board];
  const tempProbabilityCount = probabilityCount;
  const tempScore = score;

  moveLeft();

  if (freeCell()) {
    lose = false;
    board = [...temp];
    probabilityCount = tempProbabilityCount;
    score = tempScore;

    return lose;
  }

  moveUp();

  if (freeCell()) {
    lose = false;
    board = [...temp];
    probabilityCount = tempProbabilityCount;
    score = tempScore;

    return lose;
  }

  board = [...temp];
  probabilityCount = tempProbabilityCount;
  score = tempScore;

  return lose;
}

function display() {
  for (let i = 0; i < board.length; i++) {
    const cells = fieldRowAll[i].querySelectorAll('.field-cell');

    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== 0) {
        cells[j].textContent = board[i][j];

        const addClass = 'field-cell--' + board[i][j];

        changeAdditionalClassCell(cells[j], addClass);
      } else {
        cells[j].textContent = '';
        changeAdditionalClassCell(cells[j]);
      }
    }
  }

  scoreDisplay.textContent = score;
}

function startGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  probabilityCount = 0;

  newCell();
  newCell();
  display();
}

start.addEventListener('click', ourEvent => {
  startGame();
  started = true;

  if (ourEvent.target.matches('.start')) {
    start.textContent = 'Restart';
    start.classList.remove('start');
    start.classList.add('restart');
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
});

document.addEventListener('keyup', e => {
  if (started === false) {
    return;
  }

  switch (e.key) {
    case 'ArrowRight':
      moveRight();
      display();
      ifWin();
      newCell();
      display();
      break;

    case 'ArrowLeft':
      moveLeft();
      display();
      ifWin();
      newCell();
      display();
      break;

    case 'ArrowUp':
      moveUp();
      display();
      ifWin();
      newCell();
      display();
      break;

    case 'ArrowDown':
      moveDown();
      display();
      ifWin();
      newCell();
      display();
      break;

    default:
      break;
  }
});
