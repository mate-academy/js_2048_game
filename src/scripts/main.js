'use strict';

let board;
let score = 0;
const rowsAmount = 4;
const columnsAmount = 4;
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const rows = document.querySelectorAll('tr');

const buttonStart = document.querySelector('.start');

buttonStart.addEventListener('click', () => {
  setGame();
  buttonStart.innerText = 'Restart';

  buttonStart.classList.remove(...buttonStart.classList);
  buttonStart.classList.add('button', 'restart');
});

function setGame() {
  score = 0;
  document.querySelector('.game-score').innerText = score;

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  rows.forEach((row, rowIndex) => {
    [...row.children].forEach((cell, colIndex) => {
      cell.id = `${rowIndex}-${colIndex}`;

      row.appendChild(cell);

      const num = board[rowIndex][colIndex];

      updateCell(cell, num);

      if (cell.innerText === '0') {
        cell.innerText = '';
      }
    });
  });

  setTwo();
  setTwo();
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
}

function isBoardFull() {
  for (let r = 0; r < rowsAmount; r++) {
    for (let c = 0; c < columnsAmount; c++) {
      if (board[r][c] === 0) {
        return false;
      }
    }
  }

  return true;
}

function hasValidMoves() {
  for (let r = 0; r < rowsAmount; r++) {
    for (let c = 0; c < columnsAmount; c++) {
      const currentNum = board[r][c];

      if (
        (r > 0 && board[r - 1][c] === currentNum)
        || (r < rowsAmount - 1 && board[r + 1][c] === currentNum)
        || (c > 0 && board[r][c - 1] === currentNum)
        || (c < columnsAmount - 1 && board[r][c + 1] === currentNum)
      ) {
        return true;
      }

      if (currentNum === 0) {
        return true;
      }
    }
  }

  return false;
}

function isWinner() {
  for (let r = 0; r < rowsAmount; r++) {
    for (let c = 0; c < columnsAmount; c++) {
      if (board[r][c] !== 2048) {
        return false;
      }
    }
  }

  return true;
}

function updateCell(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num !== '') {
    tile.innerText = num.toString();

    if (num <= 1024) {
      tile.classList.add('field-cell' + `--${num.toString()}`);
    } else {
      tile.classList.add('field-cell--2048');
    }
  }
}

function hasEmptyTile() {
  for (let r = 0; r < rowsAmount; r++) {
    for (let c = 0; c < columnsAmount; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function setTwo() {
  if (!hasEmptyTile() || !hasValidMoves()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * 4);
    const c = Math.floor(Math.random() * 4);

    if (board[r][c] === 0) {
      board[r][c] = 2;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = '2';
      tile.classList.remove(...tile.classList);
      tile.classList.add('field-cell', 'field-cell--2');
      found = true;
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
  return row.filter(num => num !== 0);
}

function slide(row) {
  let newRow = filterZero(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < rowsAmount) {
    newRow.push(0);
  }

  if (isBoardFull()) {
    messageLose.classList.remove('hidden');
  } else {
    messageLose.classList.add('hidden');
  }

  if (isWinner()) {
    messageWin.classList.remove('hidden');
  }

  return newRow;
}

function slideLeft() {
  for (let r = 0; r < rowsAmount; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columnsAmount; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateCell(tile, num);
    }
  }

  for (let r = 0; r < rowsAmount; r++) {
    for (let c = 0; c < columnsAmount; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      if (tile.innerText === '0') {
        tile.innerText = '';
      }
    }
  }

  if (isBoardFull()) {
    messageLose.classList.remove('hidden');
  } else {
    messageLose.classList.add('hidden');
  }

  if (isWinner()) {
    messageWin.classList.remove('hidden');
  }
}

function slideRight() {
  for (let r = 0; r < rowsAmount; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);
    board[r] = row.reverse();

    for (let c = 0; c < columnsAmount; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateCell(tile, num);
    }
  }

  for (let r = 0; r < rowsAmount; r++) {
    for (let c = 0; c < columnsAmount; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      if (tile.innerText === '0') {
        tile.innerText = '';
      }
    }
  }

  if (isBoardFull()) {
    messageLose.classList.remove('hidden');
  } else {
    messageLose.classList.add('hidden');
  }

  if (isWinner()) {
    messageWin.classList.remove('hidden');
  }
}

function slideUp() {
  for (let c = 0; c < rowsAmount; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < columnsAmount; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateCell(tile, num);
    }
  }

  for (let r = 0; r < rowsAmount; r++) {
    for (let c = 0; c < columnsAmount; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      if (tile.innerText === '0') {
        tile.innerText = '';
      }
    }
  }

  if (isBoardFull()) {
    messageLose.classList.remove('hidden');
  } else {
    messageLose.classList.add('hidden');
  }

  if (isWinner()) {
    messageWin.classList.remove('hidden');
  }
}

function slideDown() {
  for (let c = 0; c < columnsAmount; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rowsAmount; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateCell(tile, num);
    }
  }

  for (let r = 0; r < rowsAmount; r++) {
    for (let c = 0; c < columnsAmount; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      if (tile.innerText === '0') {
        tile.innerText = '';
      }
    }
  }

  if (isBoardFull()) {
    messageLose.classList.remove('hidden');
  } else {
    messageLose.classList.add('hidden');
  }

  if (isWinner()) {
    messageWin.classList.remove('hidden');
  }
}
