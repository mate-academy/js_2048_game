'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;
let isGameStarted = false;

document.addEventListener('DOMContentLoaded', () => {
  board = Array.from({ length: rows }, () => Array(columns).fill(0));
  renderBoard();

  const startButton = document.querySelector('.start');

  startButton.addEventListener('click', startGame);

  const restartButton = document.querySelector('.restart');

  restartButton.addEventListener('click', restartGame);
});

function startGame() {
  isGameStarted = true;

  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.start').classList.add('hidden');
  document.querySelector('.restart').classList.remove('hidden');

  addRandomTile();
  addRandomTile();
}

function restartGame() {
  board = Array.from({ length: rows }, () => Array(columns).fill(0));
  score = 0;
  isGameStarted = false;
  renderBoard();

  document.querySelector('.game-score').innerText = score;

  document.querySelector('.restart').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.start').classList.remove('hidden');
  document.querySelector('.message-start').classList.remove('hidden');
}

function winGame() {
  document.querySelector('.message-win').classList.remove('hidden');
  isGameStarted = false;
}

function loseGame() {
  document.querySelector('.message-lose').classList.remove('hidden');
  isGameStarted = false;
}

function isNoMovesLeft() {
  if (hasEmptyTile()) {
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const current = board[r][c];

      if (r > 0 && board[r - 1][c] === current) {
        return false;
      }

      if (r < rows - 1 && board[r + 1][c] === current) {
        return false;
      }

      if (c > 0 && board[r][c - 1] === current) {
        return false;
      }

      if (c < columns - 1 && board[r][c + 1] === current) {
        return false;
      }
    }
  }

  return true;
}

function renderBoard() {
  const gameField = document.getElementById('board');

  gameField.innerHTML = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.createElement('div');

      tile.id = `${r}-${c}`;
      updateTile(tile, board[r][c]);
      gameField.append(tile);
    }
  }
}

function hasEmptyTile() {
  return board.some(row => row.includes(0));
}

function addRandomTile() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      const newValue = Math.random() < 0.6 ? 2 : 4;

      board[r][c] = newValue;

      const tile = document.getElementById(`${r}-${c}`);

      updateTile(tile, newValue, true);
      found = true;
    }
  }
}

function updateTile(tile, num, animate = false) {
  tile.innerText = num > 0 ? num : '';

  tile.className = `field-cell${num > 0 && num <= 2048
    ? ` field-cell--${num}`
    : ''
  }`;

  if (animate) {
    tile.style.transform = 'scale(0.5)';

    setTimeout(() => {
      tile.style.transform = 'scale(1)';
    }, 50);
  }
}

document.addEventListener('keyup', (e) => {
  const originalBoard = JSON.stringify(board);

  if (!isGameStarted) {
    return;
  }

  const moves = {
    ArrowLeft: slideLeft,
    ArrowRight: slideRight,
    ArrowUp: slideUp,
    ArrowDown: slideDown,
  };

  if (moves[e.code]) {
    moves[e.code]();

    if (originalBoard !== JSON.stringify(board)) {
      addRandomTile();
    }
  }

  document.querySelector('.game-score').innerText = score;
});

/* eslint-disable no-param-reassign */
function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  row = filterZero(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  row = filterZero(row);

  while (row.length < columns) {
    row.push(0);
  }

  return row;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    board[r] = slide(board[r]);
  }
  updateBoard();
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    board[r] = slide(board[r].reverse()).reverse();
  }
  updateBoard();
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    const column = board.map(row => row[c]);
    const newColumn = slide(column);

    for (let r = 0; r < rows; r++) {
      board[r][c] = newColumn[r];
    }
  }
  updateBoard();
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    const column = board.map(row => row[c]).reverse();
    const newColumn = slide(column).reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = newColumn[r];
    }
  }
  updateBoard();
}

function updateBoard() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(`${r}-${c}`);

      updateTile(tile, board[r][c]);
    }

    if (board[r].includes(2048)) {
      winGame();

      return;
    };

    if (isNoMovesLeft()) {
      loseGame();
    }
  }
}
