'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;
const start = document.querySelector('.start');
const restart = document.querySelector('.restart');
const messageStart = document.querySelector('.message__start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

restart.style.display = 'none';

start.addEventListener('click', () => {
  setTwo();
  setTwo();
  start.style.display = 'none';
  messageStart.style.display = 'none';
  restart.style.display = 'block';
});

restart.addEventListener('click', () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      board[r][c] = 0;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = '';
      tile.classList = 'tile';
    }
  }

  score = 0;
  document.querySelector('.game-score').innerText = score;
  start.style.display = 'block';
  restart.style.display = 'none';
  messageLose.classList.add('hidden');
  messageStart.style.display = 'block';
});

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

      document.querySelector('.board').append(tile);
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
    messageLose.classList.remove('hidden');

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
      tile.classList.add('tile--2');
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
      tile.classList.add('tile--' + num.toString());
    }

    if (num === 2048) {
      messageWin.classList.remove('hidden');
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
  document.querySelector('.game-score').innerText = score;
});

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function slide(row) {
  let Row = row;

  Row = filterZero(Row);

  for (let i = 0; i < Row.length; i++) {
    if (Row[i] === Row[i + 1]) {
      Row[i] *= 2;
      Row[i + 1] = 0;
      score += Row[i];
    }
  }

  Row = filterZero(Row);

  while (Row.length < columns) {
    Row.push(0);
  }

  return Row;
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
