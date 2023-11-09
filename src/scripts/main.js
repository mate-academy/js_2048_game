'use strict';

const startButton = document.querySelector('.start');
const tableRows = document.querySelector('tbody').rows;
const totalScore = document.querySelector('.game-score');

let board;
let score = 0;
const rows = 4;
const columns = 4;
const goalNumber = 2048;
const cellTwo = 2;
const cellFour = 4;

startButton.addEventListener('click', () => {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  showMessage('start');
  startButton.classList.add('restart');
  startButton.innerText = 'Restart';
  showMessage();

  generateNewCell();
  generateNewCell();
});

function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (num > 0) {
    cell.innerText = num.toString();
    cell.classList.add(`field-cell--${num.toString()}`);
  }
}

function updateGame() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const currentCell = tableRows[i].cells[j];
      const num = board[i][j];

      updateCell(currentCell, num);
    }
  }

  totalScore.innerText = score.toString();
}

function checkForEmpty() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (board[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
}

function canMoveLeft() {
  for (let i = 0; i < rows; i++) {
    for (let j = 1; j < columns; j++) {
      if (board[i][j] === 0) {
        return true;
      }

      if (board[i][j] === board[i][j - 1]) {
        return true;
      }
    }
  }

  return false;
}

function canMoveRight() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns - 1; j++) {
      if (board[i][j] === 0) {
        return true;
      }

      if (board[i][j] === board[i][j + 1]) {
        return true;
      }
    }
  }

  return false;
}

function canMoveUp() {
  for (let j = 0; j < columns; j++) {
    for (let i = 1; i < rows; i++) {
      if (board[i][j] === 0) {
        return true;
      }

      if (board[i][j] === board[i - 1][j]) {
        return true;
      }
    }
  }

  return false;
}

function canMoveDown() {
  for (let j = 0; j < columns; j++) {
    for (let i = 0; i < rows - 1; i++) {
      if (board[i][j] === 0) {
        return true;
      }

      if (board[i][j] === board[i + 1][j]) {
        return true;
      }
    }
  }

  return false;
}

function generateNewCell() {
  if (!checkForEmpty()) {
    return;
  }

  const randomValue = Math.random() > 0.5 ? cellTwo : cellFour;

  while (true) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * columns);

    if (board[row][col] === 0) {
      if (canMoveLeft() || canMoveRight() || canMoveUp() || canMoveDown()) {
        board[row][col] = randomValue;
        break;
      }
    }
  }

  updateGame();
}

let moved = false;

document.addEventListener('keyup', (direction) => {
  if (gameLost()) {
    showMessage('loser');

    return;
  }

  moved = false;

  switch (direction.code) {
    case 'ArrowLeft':
      if (canMoveLeft()) {
        moveLeft();
        moved = true;
      }
      break;

    case 'ArrowRight':
      if (canMoveRight()) {
        moveRight();
        moved = true;
      }
      break;

    case 'ArrowUp':
      if (canMoveUp()) {
        moveUp();
        moved = true;
      }
      break;

    case 'ArrowDown':
      if (canMoveDown()) {
        moveDown();
        moved = true;
      }
      break;
  }

  if (moved) {
    moved = false;
    generateNewCell();
  }
});

function gameLost() {
  let check = false;

  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < columns - 1; j++) {
      if (i < rows - 1) {
        if (board[i][j] === board[i + 1][j]
          || board[i][j] === board[i][j + 1]) {
          check = true;
        }
      }
    }
  }

  if (!check && !checkForEmpty()) {
    return true;
  }

  return false;
}

function filterZero(row) {
  return row.filter(el => el !== 0);
}

function move(row) {
  let newRow = filterZero(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (newRow[i] === newRow[i + 1] && isFinite(newRow[i])) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];

      if (newRow[i] === goalNumber) {
        showMessage('winner');
      }
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
}

function moveLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = move(row);
    board[r] = row;
  }

  updateGame();
}

function moveRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = move(row.reverse());
    board[r] = row.reverse();
  }

  updateGame();
}

function moveUp() {
  for (let c = 0; c < columns; c++) {
    let row = [];

    for (let r = 0; r < rows; r++) {
      row.push(board[r][c]);
    }

    row = move(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
    }
  }

  updateGame();
}

function moveDown() {
  for (let c = 0; c < columns; c++) {
    let row = [];

    for (let r = 0; r < rows; r++) {
      row.push(board[r][c]);
    }

    row = move(row.reverse());
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
    }
  }

  updateGame();
}

function showMessage(type) {
  const allMessage = document.querySelectorAll('.message');

  if (!type) {
    allMessage.forEach(el => el.classList.add('hidden'));

    return;
  }

  const message = document.querySelector(`.message-${type}`);

  allMessage.forEach(el => el.classList.add('hidden'));
  message.classList.remove('hidden');
};
