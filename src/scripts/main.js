'use strict';

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;
const rows = 4;
const columns = 4;
const goalNumber = 2048;

const startButton = document.querySelector('.start');
const boardCells = document.querySelectorAll('.field-cell');
const totalScore = document.querySelector('.game-score');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.innerHTML = 'Restart';
    showMessage();

    generateNewCell();
    generateNewCell();
    updateCell();
  } else if (startButton.classList.contains('restart')) {
    showMessage();

    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    score = 0;

    generateNewCell();
    generateNewCell();
    updateCell();
  }
});

function generateNewCell() {
  const emptyCells = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (!board[row][col]) {
        emptyCells.push({
          row, col,
        });
      }
    }
  }

  if (emptyCells.length > 0) {
    const { row, col }
      = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
}

function updateCell() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cellValue = board[row][col];
      const index = row * rows + col;
      const cell = boardCells[index];

      cell.innerText = '';
      cell.classList.value = '';
      cell.classList.add('field-cell');

      if (cellValue > 0) {
        cell.innerText = cellValue.toString();
        cell.classList.add(`field-cell--${cellValue.toString()}`);
      }
    }
  }

  totalScore.innerHTML = score;
}

document.addEventListener('keydown', (e) => {
  let moved = false;

  switch (e.key) {
    case 'ArrowRight':
      moved = moveRight();
      break;

    case 'ArrowLeft':
      moved = moveLeft();
      break;

    case 'ArrowUp':
      moved = moveUp();
      break;

    case 'ArrowDown':
      moved = moveDown();
      break;

    default:
      break;
  }

  if (moved) {
    generateNewCell();
    updateCell();

    if (isGameOver()) {
      showMessage('lose');
      enableScroll();
    }
  }
});

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function move(row) {
  let newRow = row;

  newRow = filterZero(newRow);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }

    if (newRow[i] === goalNumber) {
      showMessage('win');
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < rows) {
    newRow.push(0);
  }

  return newRow;
}

function areArraysEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function moveLeft() {
  let moved = false;

  for (let r = 0; r < rows; r++) {
    let row = board[r];
    const originalRow = [...row];

    row = move(row);
    board[r] = row;

    if (!moved && !areArraysEqual(originalRow, row)) {
      moved = true;
    }
  }

  return moved;
}

function moveRight() {
  let moved = false;

  for (let r = 0; r < rows; r++) {
    let row = board[r];

    const originalRow = [...row];

    row.reverse();
    row = move(row);

    row.reverse();

    board[r] = row;

    if (!moved && !areArraysEqual(originalRow, row)) {
      moved = true;
    }
  }

  return moved;
}

function moveUp() {
  let moved = false;

  for (let col = 0; col < columns; col++) {
    let column = [
      board[0][col],
      board[1][col],
      board[2][col],
      board[3][col],
    ];

    const originalColumn = [...column];

    column = move(column);

    for (let row = 0; row < rows; row++) {
      board[row][col] = column[row];
    }

    if (!moved && !areArraysEqual(originalColumn, column)) {
      moved = true;
    }
  }

  return moved;
}

function moveDown() {
  let moved = false;

  for (let col = 0; col < columns; col++) {
    let column = [
      board[0][col],
      board[1][col],
      board[2][col],
      board[3][col],
    ];

    const originalColumn = [...column];

    column.reverse();
    column = move(column);
    column.reverse();

    for (let row = 0; row < rows; row++) {
      board[row][col] = column[row];
    }

    if (!moved && !areArraysEqual(originalColumn, column)) {
      moved = true;
    }
  }

  return moved;
}

function isGameOver() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (board[row][col] === 0) {
        return false;
      }

      if (
        (col < columns - 1 && board[row][col]
          === board[row][col + 1])
        || (row < rows - 1 && board[row][col]
          === board[row + 1][col])
      ) {
        return false;
      }
    }
  }

  return true;
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
}

function enableScroll() {
  document.body.style.overflow = 'auto';
}
