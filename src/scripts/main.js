'use strict';

// write your code here
const body = document.querySelector('body');

const rows = body.querySelectorAll('tr');
const button = document.querySelector('button');
const tableScore = body.querySelector('.game-score');
const messages = body.querySelectorAll('.message');
const winMessage = body.querySelector('.message-win');
const loseMessage = body.querySelector('.message-lose');
const cells = body.querySelectorAll('.field-cell');

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const newNumber = [2, 2, 2, 2, 2, 2, 2, 2, 4, 2];
let gameEnded = false;

button.addEventListener('click', (e) => {
  if (!button.classList.contains('restart')) {
    button.classList.remove('start');
    button.innerText = 'Restart';
    button.classList.add('restart');
  }

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      board[r][c] = 0;

      const tile = rows[r].children[c];

      updateTile(tile, 0);
    }
  }

  [...messages].map(message => message.classList.add('hidden'));

  tableScore.innerText = 0;

  addNumber();
  addNumber();

  gameEnded = false;
});

document.addEventListener('keydown', (e) => {
  if (!button.classList.contains('restart') || gameEnded === true) {
    return;
  }

  const boardClone = JSON.stringify(board);

  switch (e.key) {
    case 'ArrowLeft':
      slideLeft();
      break;

    case 'ArrowRight':
      slideRight();
      break;

    case 'ArrowUp':
      slideUp();
      break;

    case 'ArrowDown':
      slideDown();
      break;
  }

  if (boardClone === JSON.stringify(board)) {
    return;
  }

  addNumber();

  if ([...cells].some(cell => cell.classList.contains('field-cell--2048'))) {
    winMessage.classList.remove('hidden');
    gameEnded = true;
  }

  if (!moveIsPossible()) {
    loseMessage.classList.remove('hidden');
  }
});

function clearZeroes(row) {
  return row.filter(element => element !== 0);
}

function slide(row) {
  let newRow = clearZeroes(row);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;

      tableScore.textContent = +tableScore.textContent + newRow[i];
    }
  }

  newRow = clearZeroes(newRow);

  while (newRow.length < 4) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  for (let row = 0; row < 4; row++) {
    const fieldRow = slide(board[row]);

    board[row] = fieldRow;

    for (let column = 0; column < 4; column++) {
      const tile = rows[row].children[column];
      const number = board[row][column];

      updateTile(tile, number);
    }
  }
}

function slideRight() {
  for (let row = 0; row < 4; row++) {
    const fieldRow = slide(board[row].reverse());

    board[row] = fieldRow.reverse();

    for (let column = 0; column < 4; column++) {
      const tile = rows[row].children[column];
      const number = board[row][column];

      updateTile(tile, number);
    }
  }
}

function slideUp() {
  for (let column = 0; column < 4; column++) {
    let fieldColumn = [board[0][column], board[1][column],
      board[2][column], board[3][column]];

    fieldColumn = slide(fieldColumn);

    board[0][column] = fieldColumn[0];
    board[1][column] = fieldColumn[1];
    board[2][column] = fieldColumn[2];
    board[3][column] = fieldColumn[3];

    for (let row = 0; row < 4; row++) {
      const tile = rows[row].children[column];
      const number = board[row][column];

      updateTile(tile, number);
    }
  }
}

function slideDown() {
  for (let column = 0; column < 4; column++) {
    let fieldColumn = [board[0][column], board[1][column],
      board[2][column], board[3][column]];

    fieldColumn = slide(fieldColumn.reverse()).reverse();

    board[0][column] = fieldColumn[0];
    board[1][column] = fieldColumn[1];
    board[2][column] = fieldColumn[2];
    board[3][column] = fieldColumn[3];

    for (let row = 0; row < 4; row++) {
      const tile = rows[row].children[column];
      const number = board[row][column];

      updateTile(tile, number);
    }
  }
}

function hasEmptyTiles() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function updateTile(tile, number) {
  tile.className = '';
  tile.innerText = '';
  tile.classList.add('field-cell');

  if (number > 0) {
    tile.classList.add(`field-cell--${number}`);
    tile.innerText = number;
  }
}

function addNumber() {
  if (!hasEmptyTiles()) {
    return;
  }

  let found = false;

  while (!found) {
    const row = Math.floor(Math.random() * 4);
    const column = Math.floor(Math.random() * 4);

    if (board[row][column] === 0) {
      const tile = rows[row].children[column];
      const randomNuber = newNumber[Math.floor(Math.random() * 10)];

      board[row][column] = randomNuber;

      tile.innerText = randomNuber;
      tile.classList.add(`field-cell--${randomNuber}`);
      found = true;
    }
  }
}

function moveIsPossible() {
  if (hasEmptyTiles()) {
    return true;
  }

  let moveX = false;
  let moveY = false;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === board[r][c + 1]) {
        moveX = true;
      }
    }
  }

  for (let c = 0; c < 4; c++) {
    const boardColumn = [board[0][c], board[1][c], board[2][c], board[3][c]];

    for (let r = 0; r < 4; r++) {
      if (boardColumn[r] === boardColumn[r + 1]) {
        moveY = true;
      }
    }
  }

  // if (!moveX && !moveY) {
  //   return false;
  // }

  // return true;
  return !((!moveX && !moveY));
}
