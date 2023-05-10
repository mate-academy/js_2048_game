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

  messageLose.classList.toggle('hidden', true);
  messageWin.classList.toggle('hidden', true);
  isStart = true;

  addTile();
  addTile();

  updateCells();
});

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
    }

    if (value > 0) {
      cell.textContent = value;
      cell.classList.remove(`field-cell--${oldValue}`);
      cell.classList.add(`field-cell--${value}`);
    }

    if (value === 2048) {
      messageWin.classList.remove('hidden');
    }
  }

  if (checkLose()) {
    messageLose.classList.remove('hidden');
  }

  gameScore.textContent = score;
};

document.addEventListener('keydown', e => {
  const newBoard = JSON.parse(JSON.stringify(board));

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

  if (canAddTile(board, newBoard)) {
    addTile();
  }

  updateCells();
});

function checkLose() {
  for (let row = 0; row < ROW_SIZE; row++) {
    for (let col = 0; col < COL_SIZE; col++) {
      if (board[row][col] === 0) {
        return false;
      }
    }
  }

  for (let row = 0; row < ROW_SIZE; row++) {
    for (let col = 0; col < COL_SIZE - 1; col++) {
      if (board[row][col] === board[row][col + 1]) {
        return false;
      }
    }
  }

  for (let col = 0; col < COL_SIZE; col++) {
    for (let row = 0; row < ROW_SIZE - 1; row++) {
      if (board[row][col] === board[row + 1][col]) {
        return false;
      }
    }
  }

  return true;
};

function filterZero(row) {
  return row.filter(cell => cell !== 0);
}

function moveCells(row) {
  let newRow = filterZero(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < COL_SIZE) {
    newRow.push(0);
  }

  return newRow;
}

function moveLeft() {
  for (let r = 0; r < ROW_SIZE; r++) {
    let row = board[r];

    row = moveCells(row);
    board[r] = row;
  }
}

function moveRight() {
  for (let r = 0; r < ROW_SIZE; r++) {
    let row = board[r];

    row = moveCells(row.reverse());
    board[r] = row.reverse();
  }
}

function moveUp() {
  for (let c = 0; c < COL_SIZE; c++) {
    let row = [];

    for (let r = 0; r < ROW_SIZE; r++) {
      row.push(board[r][c]);
    }

    row = moveCells(row);

    for (let r = 0; r < ROW_SIZE; r++) {
      board[r][c] = row[r];
    }
  }
}

function moveDown() {
  for (let c = 0; c < COL_SIZE; c++) {
    let row = [];

    for (let r = 0; r < ROW_SIZE; r++) {
      row.push(board[r][c]);
    }

    row = moveCells(row.reverse());
    row.reverse();

    for (let r = 0; r < ROW_SIZE; r++) {
      board[r][c] = row[r];
    }
  }
}

function canAddTile(originalBoard, copiedBoard) {
  for (let r = 0; r < ROW_SIZE; r++) {
    for (let c = 0; c < COL_SIZE; c++) {
      if (originalBoard[r][c] !== copiedBoard[r][c]) {
        return true;
      }
    }
  }

  return false;
}
