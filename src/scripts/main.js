'use strict';

const startButton = document.querySelector('.start');
const table = document.querySelector('tbody');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const scoreGame = document.querySelector('.game-score');
const columns = 4;
const rows = 4;
let score = 0;
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

startButton.addEventListener('click', gameStart);

function gameStart() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;

  startButton.classList.replace('start', 'restart');
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');

  startButton.innerText = 'Restart';

  randomNum();
  randomNum();
};

document.addEventListener('keyup', e => {
  if (!startButton.classList.contains('restart')) {
    return;
  };

  e.preventDefault();

  switch (e.code) {
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

  randomNum();
  renderHtml();
});

function renderHtml() {
  for (let i = 0; i < columns; i++) {
    for (let k = 0; k < columns; k++) {
      const currentCell = table.rows[i].cells[k];
      const value = board[i][k];

      currentCell.innerText = '';
      currentCell.classList.value = '';
      currentCell.className = `field-cell`;

      if (value > 0) {
        currentCell.innerText = value;
        currentCell.classList.add(`field-cell--${value}`);
      }

      if (value === 2048) {
        messageWin.classList.remove('hidden');
        startButton.classList.replace('restart', 'start');
        startButton.innerText = 'Start';
      }
    }
  }

  scoreGame.innerText = score;

  if (isGameOver()) {
    messageLose.classList.remove('hidden');
  }
}

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(rowparam) {
  let row = filterZero(rowparam);

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
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);
    board[r] = row.reverse();
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];
  }
}

function hasEmptyCell() {
  return board.some(row => row.some(cell => !cell));
}

function randomNum() {
  if (!hasEmptyCell()) {
    return;
  }

  let found = false;

  while (!found) {
    const num = Math.random() < 0.1 ? 4 : 2;
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = num;
      found = true;
    }
  }

  renderHtml();
}

function isGameOver() {
  if (hasEmptyCell()) {
    return false;
  }

  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < columns - 1; cell++) {
      const isNextSame = board[row][cell] === board[row][cell + 1];
      const isBelowSame = board[cell][row] === board[cell + 1][row];

      if (isNextSame || isBelowSame) {
        return false;
      }
    }
  }

  return true;
}
