'use strict';

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

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      cells[i].id = `${row}-${column}`;

      const num = board[row][column];

      updateTile(cells[i], num);

      i++;
    }
  }

  setRandom();
  setRandom();
  document.addEventListener('keyup', handler);
}

function hasEmptyTile() {
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (board[row][column] === 0) {
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
      slideLeftAndRight(true);
      setRandom();

      break;
    }

    case 'ArrowRight': {
      slideLeftAndRight(false);
      setRandom();

      break;
    }

    case 'ArrowUp': {
      slideUpAndDown(true);
      setRandom();

      break;
    }

    case 'ArrowDown': {
      slideUpAndDown(false);
      setRandom();

      break;
    }
  }

  lose();
  win();
};

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

function slideLeftAndRight(left) {
  for (let amazingRow = 0; amazingRow < rows; amazingRow++) {
    let row = board[amazingRow];

    if (left) {
      row = slide(row);
      board[amazingRow] = row;
    } else {
      row.reverse();
      row = slide(row);
      row.reverse();
      board[amazingRow] = row;
    }

    for (let column = 0; column < columns; column++) {
      const tile = document.getElementById(`${amazingRow}-${column}`);
      const num = board[amazingRow][column];

      updateTile(tile, num);
    }
  }
}

function slideUpAndDown(up) {
  for (let column = 0; column < columns; column++) {
    let row = [board[0][column],
      board[1][column],
      board[2][column],
      board[3][column]];

    if (up) {
      row = slide(row);
    } else {
      row.reverse();
      row = slide(row);
      row.reverse();
    }

    for (let amazingRow = 0; amazingRow < columns; amazingRow++) {
      board[amazingRow][column] = row[amazingRow];

      const tile = document.getElementById(`${amazingRow}-${column}`);
      const num = board[amazingRow][column];

      updateTile(tile, num);
    }
  }
}

function lose() {
  if (hasEmptyTile()) {
    return;
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns - 1; column++) {
      if (board[column][row] === board[column + 1][row]
        || board[row][column] === board[row][column + 1]) {
        messageLose.classList.remove('hidden');
        document.removeEventListener('keyup', handler);
      }
    }
  }
}

function win() {
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (board[row][column] === 2048) {
        messageWin.classList.remove('hidden');
      }
    }
  }
}
