/* eslint-disable max-len */
'use strict';

const messegLose = document.querySelector('.message-lose');
const messegWin = document.querySelector('.message-win');
const messegStart = document.querySelector('.message-start');
const Restarttbutton = document.querySelector('.restart');
const scoreTable = document.querySelector('.game-score');
const tiles = document.getElementsByClassName('tile');
const StartButton = document.querySelector('.start');

const rows = 4;
const columns = 4;
let score = 0;
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let stopGame = false;

StartButton.addEventListener('click', () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.createElement('div');
      const num = board[r][c];

      tile.id = r.toString() + '-' + c.toString();

      upDateTile(tile, num);
      document.getElementById('board').append(tile);
    }
  }

  StartButton.classList.add('hidden');
  messegStart.classList.add('hidden');
  Restarttbutton.classList.remove('hidden');

  addNum();
  addNum();
});

Restarttbutton.addEventListener('click', function restartGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const tileArr = Array.from(tiles);

  tileArr.forEach((tile) => {
    tile.innerText = '';
    tile.className = 'tile';
  });

  score = 0;
  scoreTable.innerHTML = score;
  messegLose.classList.add('hidden');
  messegWin.classList.add('hidden');
  addNum();
  addNum();

  stopGame = false;
});

function endGame() {
  if (gameOver()) {
    stopGame = true;
    messegLose.classList.remove('hidden');
  }
}

function empty() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function addNum() {
  if (!empty()) {
    return true;
  }

  const emptyCells = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({
          row: r,
          column: c,
        });
      }
    }
  }

  if (emptyCells.length === 0) {
    return false;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const { row, column } = emptyCells[randomIndex];
  const num = Math.random() < 0.01 ? 4 : 2;

  board[row][column] = num;

  const tile = document.getElementById(row.toString() + '-' + column.toString());

  tile.innerText = num.toString();
  tile.classList.add(`tile--${num}`);

  return true;
}

function upDateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('tile');

  if (num > 0) {
    tile.innerText = num.toString();

    if (num <= 2048) {
      tile.classList.add(`tile--${num}`);
    }

    if (num === 2048) {
      messegWin.classList.remove('hidden');
    }
  }
}

document.addEventListener('keydown', even => {
  if (stopGame) {
    return false;
  }

  switch (even.key) {
    case 'ArrowRight':
      slideRight();
      break;

    case 'ArrowLeft':
      slideLeft();
      break;

    case 'ArrowUp':
      slideUp();
      break;

    case 'ArrowDown':
      slideDown();
      break;
  }

  scoreTable.innerText = score;
});

function filterZeros(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let r = row;

  r = filterZeros(r);

  for (let i = 0; i < r.length; i++) {
    if (r[i] === r[i + 1]) {
      r[i] *= 2;
      r[i + 1] = 0;
      score += r[i];
    }
  }

  r = filterZeros(r);

  while (r.length < columns) {
    r.push(0);
  }

  return r;
}

function slideLeft() {
  let moved = false;

  for (let r = 0; r < rows; r++) {
    const originalRow = board[r].slice();

    board[r] = slide(board[r]);

    if (!arraysEqual(originalRow, board[r])) {
      moved = true;
    }

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      upDateTile(tile, num);
    }
  }

  if (moved) {
    addNum();
    endGame();
  }
}

function slideRight() {
  let moved = false;

  for (let r = 0; r < rows; r++) {
    const originalRow = board[r].slice();
    const shiftedRow = slide(board[r].slice().reverse()).reverse();

    board[r] = shiftedRow;

    if (!arraysEqual(originalRow, board[r])) {
      moved = true;
    }

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      const num = board[r][c];

      upDateTile(tile, num);
    }
  }

  if (moved) {
    addNum();
    endGame();
  }
}

function slideUp() {
  let moved = false;

  for (let c = 0; c < columns; c++) {
    const originalCol = getColumn(board, c).slice();
    const shiftedCol = slide(getColumn(board, c)).slice();

    for (let r = 0; r < rows; r++) {
      board[r][c] = shiftedCol[r];
    }

    if (!arraysEqual(originalCol, getColumn(board, c))) {
      moved = true;
    }

    for (let r = 0; r < rows; r++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      upDateTile(tile, num);
    }
  }

  if (moved) {
    addNum();
    endGame();
  }
}

function slideDown() {
  let moved = false;

  for (let c = 0; c < columns; c++) {
    const originalCol = getColumn(board, c).slice().reverse();
    const shiftedCol = slide(getColumn(board, c).slice().reverse()).reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = shiftedCol[r];
    }

    if (!arraysEqual(originalCol, getColumn(board, c).slice().reverse())) {
      moved = true;
    }

    for (let r = 0; r < rows; r++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      upDateTile(tile, num);
    }
  }

  if (moved) {
    addNum();
    endGame();
  }
}

function getColumn(matrix, col) {
  return matrix.map(row => row[col]);
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

function gameOver() {
  if (empty()) {
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const rc = board[r][c];

      if (c < columns - 1 && rc === board[r][c + 1]) {
        return false;
      }

      if (r < rows - 1 && rc === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true;

  // eslint-disable-next-line no-console, no-unreachable
  console.log('Finish');
}
