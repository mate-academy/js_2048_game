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
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      board[i][j] = 0;

      const tile = document.getElementById(i.toString() + '-' + j.toString());

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

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const tile = document.createElement('div');

      tile.id = i.toString() + '-' + j.toString();

      const num = board[i][j];

      updateTile(tile, num);

      document.querySelector('.board').append(tile);
    }
  }
}

function hasEmptyTile() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (board[i][j] === 0) {
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

  let isfound = false;

  while (!isfound) {
    const rowRandom = Math.floor(Math.random() * rows);
    const columnRandom = Math.floor(Math.random() * columns);

    if (board[rowRandom][columnRandom] === 0) {
      board[rowRandom][columnRandom] = 2;

      const tile = document.getElementById(
        rowRandom.toString() + '-' + columnRandom.toString()
      );

      tile.innerText = '2';
      tile.classList.add('tile--2');
      isfound = true;
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
  switch (e.code) {
    case 'ArrowLeft':
      slideLeft();
      setTwo();
      break;
    case 'ArrowRight':
      slideRight();
      setTwo();
      break;
    case 'ArrowUp':
      slideUp();
      setTwo();
      break;
    case 'ArrowDown':
      slideDown();
      setTwo();
      break;

    default:
      break;
  }
  document.querySelector('.game-score').innerText = score;
});

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function slide(row) {
  let copyRow = [...row];

  copyRow = filterZero(copyRow);

  for (let i = 0; i < copyRow.length; i++) {
    if (copyRow[i] === copyRow[i + 1]) {
      copyRow[i] *= 2;
      copyRow[i + 1] = 0;
      score += copyRow[i];
    }
  }

  copyRow = filterZero(copyRow);

  while (copyRow.length < columns) {
    copyRow.push(0);
  }

  return copyRow;
}

function slideLeft() {
  for (let i = 0; i < rows; i++) {
    let row = board[i];

    row = slide(row);
    board[i] = row;

    for (let j = 0; j < columns; j++) {
      const tile = document.getElementById(i.toString() + '-' + j.toString());
      const num = board[i][j];

      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let i = 0; i < rows; i++) {
    let row = board[i];

    row.reverse();
    row = slide(row);
    row.reverse();
    board[i] = row;

    for (let j = 0; j < columns; j++) {
      const tile = document.getElementById(i.toString() + '-' + j.toString());
      const num = board[i][j];

      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let i = 0; i < columns; i++) {
    let row = [board[0][i], board[1][i], board[2][i], board[3][i]];

    row = slide(row);

    for (let j = 0; j < rows; j++) {
      board[j][i] = row[j];

      const tile = document.getElementById(j.toString() + '-' + i.toString());
      const num = board[j][i];

      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let i = 0; i < columns; i++) {
    let row = [board[0][i], board[1][i], board[2][i], board[3][i]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let j = 0; j < rows; j++) {
      board[j][i] = row[j];

      const tile = document.getElementById(j.toString() + '-' + i.toString());
      const num = board[j][i];

      updateTile(tile, num);
    }
  }
}
