'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;
const messageLost = document.getElementById('lose-message');
const startButton = document.getElementById('button-start');
const messageStart = document.getElementById('start-message');
const messageWon = document.getElementById('won-message');
const gameScore = document.getElementById('game-score');

startButton.addEventListener('click', (e) => {
  setGame();
});

function setGame() {
  score = 0;
  gameScore.innerText = score;
  messageStart.classList.add('hidden');
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.innerText = 'Restart';

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(
        r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }

  setRandom();
  setRandom();
}

function hasEmpty() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
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
      const tile = document.getElementById(
        r.toString() + '-' + c.toString());

      found = true;

      if (probability === 0) {
        const num = 4;

        board[r][c] = num;
        tile.innerText = num.toString();
        tile.classList.add('field-cell--' + num);
      } else {
        const num = 2;

        board[r][c] = num;
        tile.innerText = num.toString();
        tile.classList.add('field-cell--' + num);
      }
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.innerText = num;

    if (num <= 2048) {
      tile.classList.add('field-cell--' + num);
    }
  }
}

document.addEventListener('keyup', (e) => {
  const prevState = board.map((arr) => {
    return arr.slice();
  });

  switch (e.code) {
    case 'ArrowLeft':
      slideLeft();

      if (isAble(prevState)) {
        setRandom();
      }
      break;
    case 'ArrowRight':
      slideRight();

      if (isAble(prevState)) {
        setRandom();
      }
      break;
    case 'ArrowUp':
      slideUp();

      if (isAble(prevState)) {
        setRandom();
      }
      break;
    case 'ArrowDown':
      slideDown();

      if (isAble(prevState)) {
        setRandom();
      }
      break;
  }

  if (isFull(board) && noMoves(board)) {
    messageLost.classList.remove('hidden');
  }

  if (won(board)) {
    messageWon.classList.remove('hidden');
  }
});

function filterZero(row) {
  return row.filter((num) => num !== 0);
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
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(
        r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
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
      const tile = document.getElementById(
        r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [];

    for (let i = 0; i < rows; i++) {
      row.push(board[i][c]);
    }

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(
        r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [];

    for (let i = 0; i < rows; i++) {
      row.push(board[i][c]);
    }

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(
        r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function isAble(prev) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (prev[r][c] !== board[r][c]) {
        return true;
      }
    }
  }

  return false;
}

function isFull(arr) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (arr[r][c] === 0) {
        return false;
      }
    }
  }

  return true;
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
