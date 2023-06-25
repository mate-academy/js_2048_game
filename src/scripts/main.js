'use strict';

const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('tbody');
let score = 0;
const rows = 4;
const columns = 4;
const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function getRandomCell() {
  if (!hasEmptyCell()) {
    return;
  }

  const r = Math.floor(Math.random() * rows);
  const c = Math.floor(Math.random() * columns);

  if (board[r][c] === 0) {
    board[r][c] = 2;
    updateGame();
  } else {
    getRandomCell();
  }
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

function winGame() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 2048) {
        messageWin.classList.remove('hidden');
      }
    }
  }
}

function resetBoard(table) {
  return table.forEach(el => el.splice(0, columns, 0, 0, 0, 0));
}

startButton.addEventListener('click', () => {
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  score = 0;
  gameScore.textContent = score;

  resetBoard(board);

  getRandomCell();
  getRandomCell();
});

function updateGame() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = gameField.children[r].children[c];
      const num = board[r][c];

      cell.textContent = '';
      cell.classList.value = '';
      cell.classList.add('field-cell');

      if (num > 0) {
        cell.classList.add(`field-cell--${num}`);
        cell.textContent = num;
      }
    }
  }
}

document.addEventListener('keydown', ev => {
  switch (ev.key) {
    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      break;
  }

  gameScore.textContent = score;

  if (!hasEmptyCell()) {
    messageLose.classList.remove('hidden');
  } else {
    messageLose.classList.add('hidden');
  }

  winGame();
  getRandomCell();
});

function slide(row) {
  let newRow = row.filter(el => el !== 0);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  newRow = newRow.filter(el => el !== 0);

  while (newRow.length < rows) {
    newRow.push(0);
  }

  return newRow;
}

function moveLeft() {
  for (let r = 0; r < rows; r++) {
    const row = board[r];

    const newRow = slide(row);

    board[r] = newRow;

    updateGame();
  }
}

function moveRight() {
  for (let r = 0; r < rows; r++) {
    const row = board[r];

    const newRow = slide([...row].reverse());

    board[r] = newRow.reverse();

    updateGame();
  }
}

function moveUp() {
  for (let c = 0; c < columns; c++) {
    const row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    const newRow = slide(row);

    board[0][c] = newRow[0];
    board[1][c] = newRow[1];
    board[2][c] = newRow[2];
    board[3][c] = newRow[3];

    updateGame();
  }
}

function moveDown() {
  for (let c = 0; c < columns; c++) {
    const row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    const newRow = slide([...row].reverse());

    newRow.reverse();

    board[0][c] = newRow[0];
    board[1][c] = newRow[1];
    board[2][c] = newRow[2];
    board[3][c] = newRow[3];

    updateGame();
  }
}
