'use strict';

// write your code here
let board;
const rows = 4;
const columns = 4;
const score = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const button = document.querySelector('.button');

const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

button.addEventListener('click', () => {
  if (button.textContent === 'Start') {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  }

  score.textContent = '0';
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');

  setGame();
});

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  let i = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      cells[i].id = `${r}-${c}`;

      const num = board[r][c];

      updateTile(cells[i], num);

      i++;
    }
  }

  setRandom();
  setRandom();
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

function setRandom() {
  if (!hasEmptyTile()) {
    return;
  }

  let isFound = false;

  while (!isFound) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = Math.random() < 0.1 ? 4 : 2;

      const tile = document.getElementById(`${r}-${c}`);

      tile.innerText = '2';
      tile.classList.add('field-cell--2');
      isFound = true;
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.innerText = num;
    tile.classList.add(`field-cell--${num}`);
  }
}

const handler = (e) => {
  switch (e.code) {
    case 'ArrowLeft': {
      slideLeft();
      setRandom();

      break;
    }

    case 'ArrowRight': {
      slideRight();
      setRandom();

      break;
    }

    case 'ArrowUp': {
      slideUp();
      setRandom();

      break;
    }

    case 'ArrowDown': {
      slideDown();
      setRandom();

      break;
    }
  }

  lose();
  win();
};

document.addEventListener('keyup', handler);

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let newRow = filterZero(row);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score.textContent = `${+score.textContent + newRow[i]}`;
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(`${r}-${c}`);
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
      const tile = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < columns; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(`${r}-${c}`);
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

    for (let r = 0; r < columns; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function lose() {
  if (hasEmptyTile()) {
    return;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (board[c][r] === board[c + 1][r] || board[r][c] === board[r][c + 1]) {
        return;
      }
    }
  }

  messageLose.classList.remove('hidden');
}

function win() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 2048) {
        messageWin.classList.remove('hidden');
      }
    }
  }
}
