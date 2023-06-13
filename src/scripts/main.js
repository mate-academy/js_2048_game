'use strict';

const gameButton = document.querySelector('.start');
const gameTable = document.querySelector('tbody');
const totalScore = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

let board;
let score = 0;
const cols = 4;
const rows = 4;

gameButton.style.outline = 'none';

gameButton.addEventListener('click', startGame);

function startGame() {
  board = [];
  score = 0;

  for (let r = 0; r < rows; r++) {
    board.push(new Array(cols).fill(0));
  }

  gameButton.classList.replace('start', 'restart');
  gameButton.innerText = 'Restart';

  startMessage.classList.add('hidden');

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
      const currentTableCell = gameTable.rows[r].cells[c];
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
    loseMessage.classList.remove('hidden');
  }
}

function gameWon() {
  winMessage.classList.remove('hidden');
  gameButton.classList.replace('restart', 'start');
  gameButton.innerText = 'Start';
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
      moveCellsLeft();
      break;
    case 'ArrowRight':
      moveCellsRight();
      break;
    case 'ArrowUp':
      moveCellsUp();
      break;
    case 'ArrowDown':
      moveCellsDown();
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

  while (newRow.length < cols) {
    newRow.push(0);
  }

  return newRow;
}

function moveCellsLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = moveCells(row);
    board[r] = row;
  }
}

function moveCellsRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = moveCells(row.reverse());
    board[r] = row.reverse();
  }
}

function moveCellsUp() {
  for (let c = 0; c < cols; c++) {
    let row = [];

    for (let r = 0; r < rows; r++) {
      row.push(board[r][c]);
    }

    row = moveCells(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
    }
  }
}

function moveCellsDown() {
  for (let c = 0; c < cols; c++) {
    let row = [];

    for (let r = 0; r < rows; r++) {
      row.push(board[r][c]);
    }

    row = moveCells(row.reverse());
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
    }
  }
}
