'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;
const messageLost = document.querySelector('.message-lose');
const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWon = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');

startButton.addEventListener('click', setGame);

function setGame() {
  score = 0;
  gameScore.innerText = score;
  messageStart.classList.add('hidden');
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.innerText = 'Restart';

  board = Array.from({ length: rows }, () => Array(columns).fill(0));

  const fieldRows = document.querySelectorAll('.field-row');

  fieldRows.forEach((row, r) => {
    const tiles = row.querySelectorAll('.field-cell');

    tiles.forEach((tile, c) => {
      tile.id = `${r}-${c}`;
      updateTile(tile, 0);
    });
  });

  setRandom();
  setRandom();
}

function hasEmpty() {
  return board.some(row => row.includes(0));
}

function setRandom() {
  if (!hasEmpty()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      const probability = Math.floor(Math.random() * 10);
      const tile = document.getElementById(`${r}-${c}`);

      found = true;

      if (probability === 0) {
        const num = 4;

        board[r][c] = num;
        tile.innerText = num.toString();
        tile.className = `field-cell field-cell--${num}`;
      } else {
        const num = 2;

        board[r][c] = num;
        tile.innerText = num.toString();
        tile.className = `field-cell field-cell--${num}`;
      }
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.className = 'field-cell';

  if (num > 0) {
    tile.innerText = num;

    if (num <= 2048) {
      tile.className = `field-cell field-cell--${num}`;
    }
  }
}

document.addEventListener('keyup', handleKey);

function handleKey(e) {
  if (messageLost.classList.contains('hidden')
  && messageWon.classList.contains('hidden')) {
    const prevState = JSON.parse(JSON.stringify(board));

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

    if (isAble(prevState)) {
      setRandom();
    }

    if (isFull(board) && noMoves(board)) {
      messageLost.classList.remove('hidden');
    }

    if (won(board)) {
      messageWon.classList.remove('hidden');
    }
  }
}

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let rowCopy = [...row];

  rowCopy = filterZero(rowCopy);

  for (let i = 0; i < rowCopy.length - 1; i++) {
    if (rowCopy[i] === rowCopy[i + 1]) {
      rowCopy[i] *= 2;
      rowCopy[i + 1] = 0;
      score += rowCopy[i];
      gameScore.innerText = score;
    }
  }

  rowCopy = filterZero(rowCopy);

  while (rowCopy.length < columns) {
    rowCopy.push(0);
  }

  return rowCopy;
}

function slideLeft() {
  board = board.map(row => slide(row));
  updateBoard();
}

function slideRight() {
  board = board.map(row => {
    const newRow = slide([...row].reverse()).reverse();

    return newRow;
  });
  updateBoard();
}

function slideUp() {
  const newBoard = Array.from({ length: rows }, () => []);

  for (let c = 0; c < columns; c++) {
    const col = board.map(row => row[c]);
    const newCol = slide(col);

    for (let r = 0; r < rows; r++) {
      newBoard[r][c] = newCol[r];
    }
  }

  board = newBoard;
  updateBoard();
}

function slideDown() {
  const newBoard = Array.from({ length: rows }, () => []);

  for (let c = 0; c < columns; c++) {
    const col = board.map(row => row[c]);

    col.reverse();

    const newCol = slide(col);

    newCol.reverse();

    for (let r = 0; r < rows; r++) {
      newBoard[r][c] = newCol[r];
    }
  }

  board = newBoard;
  updateBoard();
}

function updateBoard() {
  const fieldRows = document.querySelectorAll('.field-row');

  fieldRows.forEach((row, r) => {
    const tiles = row.querySelectorAll('.field-cell');

    tiles.forEach((tile, c) => {
      updateTile(tile, board[r][c]);
    });
  });
}

function isAble(prev) {
  return JSON.stringify(prev) !== JSON.stringify(board);
}

function isFull(arr) {
  return arr.every(row => row.every(cell => cell !== 0));
}

function noMoves(arr) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (arr[r][c] === arr[r][c + 1]) {
        return false;
      }
    }
  }

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < columns; c++) {
      if (arr[r][c] === arr[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

function won(arr) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (arr[r][c] === 2048) {
        return true;
      }
    }
  }

  return false;
}

setGame();
