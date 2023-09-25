'use strict';

const startBtn = document.querySelector('.start');
const scoreCell = document.querySelector('.game-score');
const winCell = document.getElementsByClassName('field-cell--2048');

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

let board = [];
let score = 0;
const rows = 4;
const columns = 4;

startBtn.addEventListener('click', setGame);

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    const fieldRowCells = document
      .querySelectorAll('.field-row')[r]
      .querySelectorAll('.field-cell');

    for (let c = 0; c < columns; c++) {
      fieldRowCells[c].id = `${r}-${c}`;

      const num = board[r][c];

      updateCell(fieldRowCells[c], num);
    }
  }

  restartGame();
  generateRandomCell();
  generateRandomCell();
}

function restartGame() {
  if (startBtn.classList.contains('start')) {
    startBtn.classList.remove('start');
    startBtn.innerText = 'Restart';
    startBtn.classList.add('restart');

    messageStart.classList.add('hidden');
  } else {
    messageLose.classList.add('hidden');
  }

  scoreCell.innerText = 0;
}

function hasEmptyCell() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function generateRandomCell() {
  if (!hasEmptyCell()) {
    return;
  }

  let found = false;

  while (!found) {
    const randomCellNum = Math.random() <= 0.1 ? 4 : 2;
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = randomCellNum;

      const cell = document.getElementById(`${r}-${c}`);

      found = true;
      updateCell(cell, randomCellNum);
    }
  }
}

function checkWin() {
  if (winCell.length > 0) {
    messageWin.classList.remove('hidden');
  }
}

function checkLose() {
  if (hasEmptyCell()) {
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === board[r][c + 1]) {
        return false;
      }
    }
  }

  for (let c = 0; c < columns; c++) {
    const row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    for (let r = 0; r < row.length; r++) {
      if (row[r] === row[r + 1]) {
        return false;
      }
    }
  }

  return true;
}

function showLoseMessage() {
  messageLose.classList.remove('hidden');
}

function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (num > 0) {
    cell.innerText = num;

    cell.classList.add(`field-cell--${num}`);
  }
}

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      slideLeft();
      break;
    case 'ArrowRight':
      slideRight();
      break;
    case 'ArrowUp':
      slideUp();
      break;
    case 'ArrowDown':
      slideDown();
      break;
  }

  generateRandomCell();
  scoreCell.innerText = score;
  checkWin();

  if (checkLose()) {
    showLoseMessage();
  }
});

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let currentRow = filterZero(row);

  for (let i = 0; i < currentRow.length - 1; i++) {
    if (currentRow[i] === currentRow[i + 1]) {
      currentRow[i] *= 2;
      currentRow[i + 1] = 0;
      score += currentRow[i];
    }
  }

  currentRow = filterZero(currentRow);

  while (currentRow.length < columns) {
    currentRow.push(0);
  }

  return currentRow;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateCell(cell, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();

    row = slide(row);

    row.reverse();
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateCell(cell, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const cell = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateCell(cell, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const cell = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateCell(cell, num);
    }
  }
}
