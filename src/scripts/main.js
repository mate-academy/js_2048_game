'use strict';

const score = document.querySelector('.game-score');
const cell = document.querySelectorAll('.field-cell');
const button = document.querySelector('.button');

const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

const rows = 4;
const columns = 4;

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
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');

  beginGame();
});

let board;

function beginGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  let i = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      cell[i].id = `${r}${c}`;

      const num = board[r][c];

      updateTile(cell[i], num);
      i++;
    }
  }

  setRandom();
  setRandom();
  document.addEventListener('keyup', handler);
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

  let findEmptyTile = false;

  while (!findEmptyTile) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = Math.random() > 0.9 ? 4 : 2;

      const tile = document.getElementById(`${r}${c}`);

      tile.innerText = `${board[r][c]}`;
      tile.classList.add(`field-cell--${board[r][c]}`);
      findEmptyTile = true;
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

const handler = (event) => {
  switch (event.code) {
    case 'ArrowLeft': {
      slideLeftRight(true);
      setRandom();

      break;
    }

    case 'ArrowRight': {
      slideLeftRight(false);
      setRandom();

      break;
    }

    case 'ArrowUp': {
      slideUpDown(true);
      setRandom();

      break;
    }

    case 'ArrowDown': {
      slideUpDown(false);
      setRandom();

      break;
    }
  }

  checkIsGameLoss();
  checkIsGameWon();
};

function tileWithoutZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let newRow = tileWithoutZero(row);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score.textContent = `${+score.textContent + newRow[i]}`;
    }
  }

  newRow = tileWithoutZero(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeftRight(left) {
  for (let i = 0; i < rows; i++) {
    let row = board[i];

    if (left) {
      row = slide(row);
      board[i] = row;
    } else {
      row.reverse();
      row = slide(row);
      row.reverse();
      board[i] = row;
    }

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(`${i}${c}`);
      const num = board[i][c];

      updateTile(tile, num);
    }
  }
}

function slideUpDown(up) {
  for (let c = 0; c < columns; c++) {
    let row = [
      board[0][c],
      board[1][c],
      board[2][c],
      board[3][c],
    ];

    if (up) {
      row = slide(row);
    } else {
      row.reverse();
      row = slide(row);
      row.reverse();
    }

    for (let r = 0; r < columns; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(`${r}${c}`);
      const number = board[r][c];

      updateTile(tile, number);
    }
  }
};

function checkIsGameLoss() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return;
      };

      if (r !== 3 && board[r][c] === board[r + 1][c]) {
        return;
      };

      if (c !== 3 && board[r][c] === board[r][c + 1]) {
        return;
      };

      if (c === 3 && r === 3 && board[r][c] === board[r - 1][c]) {
        return;
      }

      if (c === 3 && r === 3 && board[r][c] === board[r][c - 1]) {
        return;
      }
    }
  }

  messageLose.classList.remove('hidden');
  document.removeEventListener('keyup', handler);
}

function checkIsGameWon() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 2048) {
        messageWin.classList.remove('hidden');
      }
    }
  }
};
