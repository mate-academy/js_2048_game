'use strict';

let board = [];
let score = 0;
const rows = 4;
const columns = 4;
let getNumber2048 = false;

const gameField = document.querySelector('.game-field');
const scoreField = document.querySelector('.game-score');
const button = document.querySelector('.button');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

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
      const num = board[r][c];

      tile.id = r.toString() + '-' + c.toString();
      updataTile(tile, num);
      gameField.append(tile);
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

function setTwoOrFour() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    const addNumber = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
    const el = Math.floor(Math.random() * 10);

    if (board[r][c] === 0) {
      board[r][c] = addNumber[el];

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = addNumber[el];
      tile.classList.add('field-cell--' + addNumber[el].toString());
      found = true;
    }
  }
}

function updataTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.innerText = num;

    if (num <= 2048) {
      tile.classList.add('field-cell--' + num.toString());
    }
  }
}

function get2048() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(`${r}-${c}`);

      if (tile.innerText === '2048') {
        getNumber2048 = true;
        winMessage.classList.remove('hidden');
      }
    }
  }
}

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let slideRow = row;

  slideRow = filterZero(slideRow);

  for (let i = 0; i < slideRow.length; i++) {
    if (slideRow[i] === slideRow[i + 1]) {
      slideRow[i] *= 2;
      slideRow[i + 1] = 0;
      score += slideRow[i];
    }
  }

  slideRow = filterZero(slideRow);

  while (slideRow.length < columns) {
    slideRow.push(0);
  }

  return slideRow;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updataTile(tile, num);
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

      updataTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < columns; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updataTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < columns; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updataTile(tile, num);
    }
  }
}

function lastStep() {
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c < columns; c++) {
      if (board[r][c - 1] === board[r][c]) {
        return true;
      }
    }
  }

  for (let c = 0; c < columns; c++) {
    for (let r = 1; r < rows; r++) {
      if (board[r - 1][c] === board[r][c]) {
        return true;
      }
    }
  }

  return false;
}

button.addEventListener('click', (e) => {
  if (button.classList.contains('start')) {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    startMessage.classList.add('hidden');

    setTwoOrFour();
    setTwoOrFour();
  } else {
    button.classList.replace('restart', 'start');
    button.innerText = 'Start';
    startMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');

    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const tile = document.getElementById(`${r}-${c}`);

        tile.innerText = '';
        tile.classList.value = '';
        tile.classList.add('field-cell');

        winMessage.classList.add('hidden');
      }
    }

    score = 0;
    scoreField.innerText = score;
  }
});

document.addEventListener('keyup', (e) => {
  if (getNumber2048) {
    return;
  }

  if (e.code === 'ArrowLeft') {
    slideLeft();
    setTwoOrFour();
  } else if (e.code === 'ArrowRight') {
    slideRight();
    setTwoOrFour();
  } else if (e.code === 'ArrowUp') {
    slideUp();
    setTwoOrFour();
  } else if (e.code === 'ArrowDown') {
    slideDown();
    setTwoOrFour();
  }

  scoreField.innerText = score;

  get2048();

  if (!lastStep()) {
    loseMessage.classList.remove('hidden');
  }
});
