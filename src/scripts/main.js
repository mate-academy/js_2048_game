'use strict';

const startButton = document.getElementsByClassName('button--start')[0];
const startMessage = document.getElementsByClassName('message--start')[0];
const restartButton = document.getElementsByClassName('button--restart')[0];
const lostMessage = document.getElementsByClassName('message--lose')[0];
const winMessage = document.getElementsByClassName('message--win')[0];
const scoreBoard = document.getElementsByClassName('game-score')[0];
const tiles = document.getElementsByClassName('tile');

// Variables
const ROWS = 4;
const COLUMNS = 4;
let board;
let score = 0;
let gameOver = false;

function printBoard() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      const tile = document.createElement('div');
      const num = board[r][c];

      tile.id = r.toString() + '-' + c.toString();
      updateTile(tile, num);

      document.getElementById('board').append(tile);
    }
  }
}

startButton.addEventListener('click', function startGame() {
  printBoard();
  startButton.classList.add('button--hidden');
  startMessage.classList.add('message--hidden');
  restartButton.classList.remove('button--hidden');
  addNum();
  addNum();
});

restartButton.addEventListener('click', function restartGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const tilesArray = Array.from(tiles);

  tilesArray.forEach((tile) => {
    tile.innerText = '';
    tile.className = 'tile';
  });

  score = 0;
  scoreBoard.innerText = score;
  lostMessage.classList.add('message--hidden');
  winMessage.classList.add('message--hidden');
  gameOver = false;
  addNum();
  addNum();
});

function checkEndGame() {
  if (endGame()) {
    gameOver = true;
    lostMessage.classList.remove('message--hidden');
  }
}

function isEmpty() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function addNum() {
  if (!isEmpty()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLUMNS);

    if (board[r][c] === 0) {
      const num = Math.random() < 0.1 ? 4 : 2;

      board[r][c] = num;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = num.toString();
      tile.classList.add(`tile--${num}`);

      tile.classList.add('tile--pop');

      setTimeout(function() {
        tile.classList.remove('tile--pop');
      }, 500);
      found = true;
    }
  }
}

document.addEventListener('keydown', event => {
  if (gameOver) {
    return;
  }

  switch (event.key) {
    case 'ArrowLeft':
      slideLeft();
      addNum();
      break;

    case 'ArrowRight':
      slideRight();
      addNum();
      break;

    case 'ArrowUp':
      slideUp();
      addNum();
      break;

    case 'ArrowDown':
      slideDown();
      addNum();
      break;
  }
  scoreBoard.innerText = score;
});

function filterZero(row) {
  return row.filter(number => number !== 0);
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('tile');

  if (num > 0) {
    tile.innerText = num.toString();

    if (num <= 2048) {
      tile.classList.add(`tile--${num}`);

      if (num === 2048) {
        winMessage.classList.remove('message--hidden');
        gameOver = true;
      }
    }
  }
}

function slide(row) {
  // eslint-disable-next-line no-param-reassign
  row = filterZero(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  // eslint-disable-next-line no-param-reassign
  row = filterZero(row);

  while (row.length < COLUMNS) {
    row.push(0);
  }

  return row;
}

function slideLeft() {
  moveLeftRight('left');
}

function slideRight() {
  moveLeftRight('right');
}

function slideUp() {
  moveUppDown('up');
}

function slideDown() {
  moveUppDown('down');
}

function moveLeftRight(direction) {
  checkEndGame();

  for (let r = 0; r < ROWS; r++) {
    let row = board[r];

    switch (direction) {
      case 'left':
        row = slide(row);
        board[r] = row;
        break;

      case 'right':
        row.reverse();
        row = slide(row);
        board[r] = row.reverse();
        break;
    }

    for (let c = 0; c < COLUMNS; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function moveUppDown(direction) {
  checkEndGame();

  for (let c = 0; c < COLUMNS; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    switch (direction) {
      case 'up':
        row = slide(row);
        break;

      case 'down':
        row.reverse();
        row = slide(row);
        row.reverse();
        break;
    }

    for (let r = 0; r < ROWS; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function endGame() {
  if (isEmpty()) {
    return false;
  }

  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      const currentTile = board[row][column];

      if (column < COLUMNS - 1 && currentTile === board[row][column + 1]) {
        return false;
      }

      if (row < ROWS - 1 && currentTile === board[row + 1][column]) {
        return false;
      }
    }
  }

  return true;
}
