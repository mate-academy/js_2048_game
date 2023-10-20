'use strict';

const mainButton = document.querySelector('.button');
const looseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

let board;
let score = 0;
const rows = 4;
const columns = 4;

window.onload = setGame;

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.createElement('div');

      tile.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateTile(tile, num);
      document.getElementById('board').append(tile);
    }
  }
}

mainButton.addEventListener('click', e => {
  if (mainButton.classList.contains('start')) {
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
    mainButton.innerHTML = 'Restart';
    document.querySelector('.message-start').classList.add('hidden');
  }

  clearField(board);
  score = 0;
  document.querySelector('.game-score').innerText = score;

  if (!looseMessage.classList.contains('hidden')) {
    looseMessage.classList.add('hidden');
  }

  if (!winMessage.classList.contains('hidden')) {
    winMessage.classList.add('hidden');
  }

  setTwo();
  setTwo();
});

function clearField(gameBoard) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      gameBoard[r][c] = 0;

      const newTile = document.getElementById(
        r.toString() + '-' + c.toString()
      );

      newTile.classList = '';
      newTile.innerText = '';
      newTile.classList.add('tile');
    }
  }
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = 2;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = '2';
      tile.classList.add('x2');
      found = true;
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('tile');

  if (num > 0) {
    tile.innerText = num;

    if (num <= 2048) {
      tile.classList.add('x' + num.toString());
    }
  }
}

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    if (canMoveLeft(board)) {
      slideLeft();
      setTwo();
    };
  } else if (e.code === 'ArrowRight') {
    if (canMoveRight(board)) {
      slideRight();
      setTwo();
    }
  } else if (e.code === 'ArrowUp') {
    if (canMoveUp(board)) {
      slideUp();
      setTwo();
    }
  } else if (e.code === 'ArrowDown') {
    if (canMoveDown(board)) {
      slideDown();
      setTwo();
    }
  }

  document.getElementsByClassName('game-score')[0].innerText = score;

  if (isLost(board)) {
    looseMessage.classList.remove('hidden');
  }

  if (isWon(board)) {
    winMessage.classList.remove('hidden');
  }
});

function isLost(field) {
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j] === 0) {
        return false;
      }
    }
  }

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      const currentCell = field[i][j];

      if (j < field[i].length - 1 && currentCell === field[i][j + 1]) {
        return false;
      }

      if (i < field.length - 1 && currentCell === field[i + 1][j]) {
        return false;
      }
    }
  }

  return true;
}

function isWon(field) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (field[r][c] === 2048) {
        return true;
      }
    }
  }
}

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
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
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
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
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

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function canMoveUp(field) {
  for (let col = 0; col < 4; col++) {
    for (let row = 1; row < 4; row++) {
      if (field[row][col] !== 0) {
        if (field[row - 1][col] === 0
          || field[row][col] === field[row - 1][col]) {
          return true;
        }
      }
    }
  }

  return false;
}

function canMoveDown(field) {
  for (let col = 0; col < 4; col++) {
    for (let row = 2; row >= 0; row--) {
      if (field[row][col] !== 0) {
        if (field[row + 1][col] === 0
          || field[row][col] === field[row + 1][col]) {
          return true;
        }
      }
    }
  }

  return false;
}

function canMoveLeft(field) {
  for (let row = 0; row < 4; row++) {
    for (let col = 1; col < 4; col++) {
      if (field[row][col] !== 0) {
        if (field[row][col - 1] === 0
          || field[row][col] === field[row][col - 1]) {
          return true;
        }
      }
    }
  }

  return false;
}

function canMoveRight(field) {
  for (let row = 0; row < 4; row++) {
    for (let col = 2; col >= 0; col--) {
      if (field[row][col] !== 0) {
        if (field[row][col + 1] === 0
          || field[row][col] === field[row][col + 1]) {
          return true;
        }
      }
    }
  }

  return false;
}
