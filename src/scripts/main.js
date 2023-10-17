'use strict';

const mainButton = document.querySelector('.button');
const rowsAmount = document.querySelectorAll('.field-row').length;
const looseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

let board;
let score = 0;
const rows = 4;
const columns = 4;

window.onload = function() {
  setGame();
};

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

  setTwo();
  setTwo();
}

mainButton.addEventListener('click', e => {
  if (mainButton.classList.contains('start')) {
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
    mainButton.innerHTML = 'Restart';
    document.querySelector('.message-start').classList.add('hidden');
  }

  score = 0;
  document.querySelector('.game-score').innerText = score;

  if (!looseMessage.classList.contains('hidden')) {
    looseMessage.classList.add('hidden');
  }

  if (!winMessage.classList.contains('hidden')) {
    winMessage.classList.add('hidden');
  }

});

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
    slideLeft();
    setTwo();
  } else if (e.code === 'ArrowRight') {
    slideRight();
    setTwo();
  } else if (e.code === 'ArrowUp') {
    slideUp();
    setTwo();
  } else if (e.code === 'ArrowDown') {
    slideDown();
    setTwo();
  }

  document.getElementsByClassName('game-score')[0].innerText = score;
});

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

