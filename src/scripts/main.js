'use strict';

const body = document.querySelector('body');
const fieldRowAll = body.querySelectorAll('.field-row');
const start = body.querySelector('.start');
let probabilityCount = 0;
const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function changeAdditionalClassCell(element, newAddClass) {
  for (let i = 2; i <= 2048; i = i * 2) {
    element.classList.remove('field-cell--' + i);
  }

  if (newAddClass) {
    element.classList.add(newAddClass);
  }
}

function newCell() {
  let cellNew = getRandomInt(16);
  let count = 0;

  for (const row of fieldRowAll) {
    const cells = row.querySelectorAll('.field-cell');

    for (const cell of cells) {
      if (count === cellNew && !cell.textContent) {
        if (probabilityCount < 10) {
          cell.textContent = 2;
          cell.classList.add('field-cell--2');
          probabilityCount++;
        } else {
          cell.textContent = 4;
          cell.classList.add('field-cell--4');
          probabilityCount = 0;
        }
      } else if (count === cellNew && cell.textContent) {
        cellNew = getRandomInt(16);
      }
      count++;
    }
  }
};

function moveLeft() {
  for (let i = 0; i < fieldRowAll.length; i++) {
    const cells = fieldRowAll[i].querySelectorAll('.field-cell');

    for (let j = 0; j < cells.length; j++) {
      if (cells[i].textContent) {
        board[i][j] = parseInt(cells[i].textContent);
      }
    }
  }

  for (let i = 0; i < board.length; i++) {
    const newRow = [];

    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== 0) {
        newRow.push(board[i][j]);
      }
    }

    for (let j = 0; j < newRow.length; j++) {
      board[i][j] = newRow[j];
    }

    for (let j = newRow.length; j < board[i].length; j++) {
      board[i][j] = 0;
    }
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 1; j < board[i].length; j++) {
      if (board[i][j - 1] === board[i][j]) {
        board[i][j - 1] = board[i][j - 1] * 2;
        board[i][j] = 0;
      }
    }
  }

  for (let i = 0; i < board.length; i++) {
    const newRow = [];

    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== 0) {
        newRow.push(board[i][j]);
      }
    }

    for (let j = 0; j < newRow.length; j++) {
      board[i][j] = newRow[j];
    }

    for (let j = newRow.length; j < board[i].length; j++) {
      board[i][j] = 0;
    }
  }

  for (let i = 0; i < board.length; i++) {
    const cells = fieldRowAll[i].querySelectorAll('.field-cell');

    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== 0) {
        cells[j].textContent = board[i][j];

        const addClass = 'field-cell--' + board[i][j];

        changeAdditionalClassCell(cells[j], addClass);
      } else {
        cells[j].textContent = '';
        changeAdditionalClassCell(cells[j]);
      }
    }
  }

  newCell();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

start.addEventListener('click', ourEvent => {
  if (start.classList.contains('start')) {
    start.textContent = 'Restart';
    newCell();
    newCell();
  }

  start.classList.remove('start');
  start.classList.add('restart');

  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowRight':
        break;

      case 'ArrowLeft':
        moveLeft();
        break;

      case 'ArrowUp':
        break;

      case 'ArrowDown':
        break;

      default:
        break;
    }
  });
});
