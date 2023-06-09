'use strict';

const startButton = document.querySelector('.start');
const table = document.querySelector('tbody');
const totalScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

let board;
let score = 0;
const cols = 4;
const rows = 4;

startButton.addEventListener('click', startGame);

function startGame() {
  board = [];
  score = 0;

  for (let r = 0; r < rows; r++) {
    board.push(new Array(cols).fill(0));
  }

  startButton.classList.replace('start', 'restart');
  startButton.innerText = 'Restart';

  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  generateInEmptyCell();
  generateInEmptyCell();
}

function generateInEmptyCell() {
  let x, y;

  do {
    x = Math.floor(Math.random() * rows);
    y = Math.floor(Math.random() * cols);

    if (board[x][y] === 0) {
      board[x][y] = Math.random() >= 0.9 ? 4 : 2;
      break;
    }
  } while (true);

  updateTable();
}

function updateTable() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const currentTableCell = table.rows[r].cells[c];
      const boardValue = board[r][c];

      currentTableCell.innerText = '';
      currentTableCell.classList.value = '';
      currentTableCell.classList.add('field-cell');

      if (boardValue > 0) {
        currentTableCell.innerText = boardValue;
        currentTableCell.classList.add(`field-cell--${boardValue}`);
      }

      if (boardValue === 2048) {
        gameWon();
      }
    }
  }

  totalScore.innerText = score;

  if (gameLost()) {
    messageLose.classList.remove('hidden');
  }
}

function gameWon() {
  messageWin.classList.remove('hidden');
  startButton.classList.replace('restart', 'start');
  startButton.innerText = 'Start';
}

function gameLost() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 0) {
        return false;
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 1; c++) {
      if (board[r][c] === board[r][c + 1]) {
        return false;
      }
    }
  }

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows - 1; r++) {
      if (board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

document.addEventListener('keydown', (e) => {
  e.preventDefault();
});

document.addEventListener('keyup', (e) => {
  const newBoard = JSON.parse(JSON.stringify(board));

  switch (e.code) {
    case 'ArrowLeft':
      slideCellsLeft();
      break;
    case 'ArrowRight':
      slideCellsRight();
      break;
    case 'ArrowUp':
      slideCellsUp();
      break;
    case 'ArrowDown':
      slideCellsDown();
      break;
    default:
      break;
  }

  if (compareBoardAfterSlide(board, newBoard)) {
    generateInEmptyCell();
  }

  updateTable();
});

function compareBoardAfterSlide(originalBoard, copiedBoard) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (originalBoard[r][c] !== copiedBoard[r][c]) {
        return true;
      }
    }
  }

  return false;
}

function filterZero(row) {
  return row.filter(cell => cell !== 0);
}

function slideCells(row) {
  let newRow = filterZero(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < cols) {
    newRow.push(0);
  }

  return newRow;
}

function slideCellsLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slideCells(row);
    board[r] = row;
  }
}

function slideCellsRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slideCells(row.reverse());
    board[r] = row.reverse();
  }
}

function slideCellsUp() {
  for (let c = 0; c < cols; c++) {
    let row = [];

    for (let r = 0; r < rows; r++) {
      row.push(board[r][c]);
    }

    row = slideCells(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
    }
  }
}

function slideCellsDown() {
  for (let c = 0; c < cols; c++) {
    let row = [];

    for (let r = 0; r < rows; r++) {
      row.push(board[r][c]);
    }

    row = slideCells(row.reverse());
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
    }
  }
}
