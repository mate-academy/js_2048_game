'use strict';

const controls = document.querySelector('.controls');
const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const restartButton = document.createElement('button');

restartButton.textContent = 'Restart';
restartButton.setAttribute('class', 'button restart hidden');

controls.append(restartButton);

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let isStart = false;
let score = 0;

const ROW_SIZE = 4;
const COL_SIZE = 4;

startButton.addEventListener('click', () => {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;
  gameScore.textContent = score;

  startButton.classList.add('hidden');
  restartButton.classList.remove('hidden');
  messageStart.classList.add('hidden');
  isStart = true;

  addTile();
  addTile();

  updateCells();
});

restartButton.addEventListener('click', () => {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;
  gameScore.textContent = score;

  startButton.classList.remove('hidden');
  restartButton.classList.add('hidden');
  messageStart.classList.remove('hidden');
  messageLose.classList.toggle('hidden', true);
  messageWin.classList.toggle('hidden', true);
  isStart = false;

  updateCells();
});

document.addEventListener('keydown', move);

function move(e) {
  if (isStart) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        moveLeft();
        break;

      case 'ArrowRight':
        e.preventDefault();
        moveRight();
        break;

      case 'ArrowUp':
        e.preventDefault();
        moveUp();
        break;

      case 'ArrowDown':
        e.preventDefault();
        moveDown();
        break;

      default:
        break;
    }
  }

  if (checkLose()) {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keydown', move);
  }

  if (checkWin()) {
    messageWin.classList.remove('hidden');
    document.removeEventListener('keydown', move);
  }
}

function addTile() {
  const emptyTiles = [];

  for (let r = 0; r < ROW_SIZE; r++) {
    for (let c = 0; c < COL_SIZE; c++) {
      if (board[r][c] === 0) {
        emptyTiles.push({
          row: r, col: c,
        });
      }
    }
  }

  const randomIndex = Math.floor(Math.random() * emptyTiles.length);
  const randomTile = emptyTiles[randomIndex];
  const randomValue = Math.random() <= 0.1 ? 4 : 2;

  board[randomTile.row][randomTile.col] = randomValue;
};

function updateCells() {
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const value = board.flat()[i];
    const oldValue = cell.textContent;

    if (value === 0) {
      cell.textContent = '';
      cell.classList.remove(`field-cell--${oldValue}`);
    } else {
      cell.textContent = value;
      cell.classList.remove(`field-cell--${oldValue}`);
      cell.classList.add(`field-cell--${value}`);
    }
  }
};

function moveLeft() {
  const checkBoard = [...board.flat()];

  for (let r = 0; r < ROW_SIZE; r++) {
    const row = board[r];
    const newRow = [];

    for (let c = 0; c < COL_SIZE; c++) {
      if (row[c] !== 0) {
        newRow.push(row[c]);
      }
    }

    while (newRow.length < row.length) {
      newRow.push(0);
    }

    board[r] = newRow;
  }

  if (mergeLeft() || !canAddTile(checkBoard)) {
    addTile();
  }

  updateCells();
}

function mergeLeft() {
  let isMerged = false;

  for (let r = 0; r < ROW_SIZE; r++) {
    for (let c = 0; c < COL_SIZE - 1; c++) {
      if (board[r][c] !== 0 && board[r][c] === board[r][c + 1]) {
        board[r][c] *= 2;
        board[r][c + 1] = 0;
        score += board[r][c];
        gameScore.textContent = score;
        isMerged = true;
      }
    }
  }

  return isMerged;
}

function moveRight() {
  const checkBoard = [...board.flat()];

  for (let r = 0; r < ROW_SIZE; r++) {
    const row = board[r];
    const newRow = [];

    for (let c = COL_SIZE - 1; c >= 0; c--) {
      if (row[c] !== 0) {
        newRow.unshift(row[c]);
      }
    }

    while (newRow.length < row.length) {
      newRow.unshift(0);
    }

    board[r] = newRow;
  }

  if (mergeRight() || !canAddTile(checkBoard)) {
    addTile();
  }

  updateCells();
};

function mergeRight() {
  let isMerged = false;

  for (let r = 0; r < ROW_SIZE; r++) {
    for (let c = COL_SIZE - 1; c >= 0; c--) {
      if (board[r][c] !== 0 && board[r][c] === board[r][c - 1]) {
        board[r][c] *= 2;
        board[r][c - 1] = 0;
        score += board[r][c];
        gameScore.textContent = score;
        isMerged = true;
      }
    }
  }

  return isMerged;
}

function moveUp() {
  const checkBoard = [...board.flat()];

  for (let c = 0; c < COL_SIZE; c++) {
    for (let r = 0; r < ROW_SIZE; r++) {
      let i = r;

      while (i > 0 && board[i - 1][c] === 0) {
        board[i - 1][c] = board[i][c];
        board[i][c] = 0;
        i--;
      }
    }
  }

  if (mergeUp() || !canAddTile(checkBoard)) {
    addTile();
  }

  updateCells();
}

function mergeUp() {
  let isMerged = false;

  for (let c = 0; c < COL_SIZE; c++) {
    for (let r = 0; r < ROW_SIZE - 1; r++) {
      if (board[r][c] !== 0 && board[r][c] === board[r + 1][c]) {
        board[r][c] *= 2;
        score += board[r][c];
        board[r + 1][c] = 0;
        gameScore.textContent = score;
        isMerged = true;
      }
    }
  }

  return isMerged;
}

function moveDown() {
  const checkBoard = [...board.flat()];

  for (let c = 0; c < COL_SIZE; c++) {
    for (let r = ROW_SIZE - 2; r >= 0; r--) {
      let i = r;

      while (i < ROW_SIZE - 1 && board[i + 1][c] === 0) {
        board[i + 1][c] = board[i][c];
        board[i][c] = 0;
        i++;
      }
    }
  }

  if (!canAddTile(checkBoard) || mergeDown()) {
    addTile();
  }

  updateCells();
}

function mergeDown() {
  let isMerged = false;

  for (let c = 0; c < COL_SIZE; c++) {
    for (let r = ROW_SIZE - 1; r > 0; r--) {
      if (board[r][c] !== 0 && board[r][c] === board[r - 1][c]) {
        board[r][c] *= 2;
        board[r - 1][c] = 0;
        score += board[r][c];
        gameScore.textContent = score;
        isMerged = true;
      }
    }
  }

  return isMerged;
}

function checkWin() {
  const isWin = board.some(row => row.includes(2048));

  return isWin;
};

function checkLose() {
  const isLose = board.every(row => row.every(cell => cell !== 0));

  return isLose;
};

function canAddTile(arr) {
  const flatBoard = board.flat();

  return flatBoard.every((element, index) => element === arr[index]);
}
