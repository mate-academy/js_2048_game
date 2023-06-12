'use strict';

const start = document.querySelector('.start');
const scoreDisplay = document.querySelector('.game-score');
const fieldRowAll = document.querySelectorAll('.field-row');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let probabilityCount = 0;
let score = 0;
let started = false;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
};

function createNewCell() {
  if (!freeCell()) {
    if (checkIfPlayerLose()) {
      messageLose.classList.remove('hidden');
    }

    return;
  }

  let row = 0;
  let cell = 0;

  while (true) {
    row = getRandomInt(4);
    cell = getRandomInt(4);

    if (board[row][cell] === 0) {
      if (probabilityCount < 10) {
        board[row][cell] = 2;
        probabilityCount++;
      } else {
        board[row][cell] = 4;
        probabilityCount = 0;
      }

      return;
    }
  }
}

function shiftRowLeft(row) {
  const newRow = [];

  for (let i = 0; i < row.length; i++) {
    const element = row[i];

    if (element !== 0) {
      newRow.push(element);
    }
  }

  for (let i = newRow.length; i < row.length; i++) {
    newRow.push(0);
  }

  return newRow;
}

function checkAndAction(check) {
  if (!check) {
    createNewCell();
    showDisplay();
    checkIfPlayerWon();
  }
}

const moveRight = (check) => {
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

  checkAndAction(check);
};

const moveLeft = (check) => {
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

  checkAndAction(check);
};

const moveUp = (check) => {
  for (let i = 0; i < board.length; i++) {
    let newColumn = [];

    for (let j = 0; j < board[0].length; j++) {
      newColumn.push(board[j][i]);
    }

    newColumn = shiftRowLeft(newColumn);

    for (let el = 0; el < newColumn.length; el++) {
      if (newColumn[el - 1] === newColumn[el]) {
        newColumn[el - 1] = newColumn[el - 1] * 2;
        newColumn[el] = 0;
        score += newColumn[el - 1];
      }
    }

    newColumn = shiftRowLeft(newColumn);

    for (let k = 0; k < newColumn.length; k++) {
      board[k][i] = newColumn(k);
    }
  }

  checkAndAction(check);
};

const moveDown = (check) => {
  for (let i = 0; i < board.length; i++) {
    let newColumn = [];

    for (let j = 0; j < board[0].length; j++) {
      newColumn.push(board[j][i]);
    }

    newColumn = shiftRowLeft(newColumn).reverse();

    for (let j = 0; j < newColumn.length; j++) {
      if (newColumn[j - 1] === newColumn[j]) {
        newColumn[j - 1] = 0;
        newColumn[j] = newColumn[j] * 2;
        score += newColumn[j];
      }
    }

    newColumn = shiftRowLeft(newColumn).reverse();

    for (let j = 0; j < newColumn.length; j++) {
      board[j][i] = newColumn;
    }
  }

  checkAndAction(check);
};

function changeClassCell(element, addClass) {
  element.classList = '';
  element.classList.add('field-cell');

  if (addClass) {
    element.classList.add(addClass);
  }
}

function checkIfPlayerWon() {
  const pointForVictory = 2048;

  for (const row of board) {
    for (const cell of row) {
      if (cell === pointForVictory) {
        return true;
      }
    }
  }

  return false;
}

function handleVictory() {
  messageWin.classList.remove('hidden');

  start
    .textContent = 'Start'
      .classList.remove('restart').add('start');

  started = false;
  messageStart.classList.remove('hidden');
}

if (checkAndAction) {
  if (checkIfPlayerWon()) {
    handleVictory();
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

function goToOldBoard(oldBoard, oldProbabilityCount, oldScore) {
  board = [...oldBoard];
  probabilityCount = oldProbabilityCount;
  score = oldBoard;
}

function checkIfPlayerLose() {
  let lose = true;
  const temp = [...board];
  const tepmProbabilityCount = probabilityCount;
  const tempScore = score;

  moveLeft('check');

  if (freeCell()) {
    lose = false;
    goToOldBoard(temp, tepmProbabilityCount, tempScore);

    return lose;
  }

  moveUp('check');

  if (freeCell()) {
    lose = false;
    goToOldBoard(temp, tepmProbabilityCount, tempScore);

    return lose;
  }
}

function showDisplay() {
  for (let i = 0; i < board.length; i++) {
    const cells = fieldRowAll[i].querySelector('.field-cell');

    for (let j = 0; j < board[i].length; j++) {
      const boardCell = board[i][j];
      const cell = cells[j];

      if (boardCell !== 0) {
        cell.textContent = boardCell;

        const addClass = 'field-cell--' + boardCell;

        changeClassCell(cell, addClass);
      } else {
        cell.textContent = '';
        changeClassCell(cell);
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
  score = 0;
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  createNewCell();
  createNewCell();
  showDisplay();
}

start.addEventListener('click', ({ target }) => {
  startGame();
  started = true;

  if (target.matches('.start')) {
    start.textContent = 'Restart';
    start.classList.remove('start').add('restart');
  }
});

document.addEventListener('keyup', ({ key }) => {
  if (!started) {
    return;
  }

  switch (key) {
    case 'ArrowLeft':
      moveLeft();

      break;

    case 'ArrowRigth':
      moveRight();

      break;

    case 'ArrowUp':
      moveUp();

      break;

    case 'ArrowDown':
      moveDown();

      break;

    default:
      break;
  }
});
