'use strict';

const table = document.querySelector('table');
let score = 0;

let board = new Array(4)
  .fill(null)
  .map(el => [0, 0, 0, 0]);

const rows = 4;
const columns = 4;

const button = document.querySelector('button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';

    messageStart.classList.add('hidden');
  } else if (button.classList.contains('restart')) {
    board = new Array(4).fill([0, 0, 0, 0]);

    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    score = 0;
  }
  setGame();
  setGame();
  updateGame();
});

function setGame() {
  const emptyTiles = [];

  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell === 0) {
        emptyTiles.push([rowIndex, cellIndex]);
      }
    });
  });

  if (!emptyTiles.length) {
    return;
  }

  const randomizer = (Math.random() <= 0.1) ? 4 : 2;
  const [rowI, cellI]
        = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

  board[rowI][cellI] = randomizer;

  isGameOver();
}

function isGameOver() {
  const anyEmptyField = board.some(row => row.some(cell => cell === 0));

  if (anyEmptyField) {
    return;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (board[r][c] === board[r][c + 1]
                || board[c][r] === board[c + 1][r]) {
        return;
      }
    }
  }

  messageLose.classList.remove('hidden');
}

function updateGame() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        table.rows[r].cells[c].innerText = '';
        table.rows[r].cells[c].className = 'field-cell';
      } else {
        table.rows[r].cells[c].innerHTML = board[r][c];
        table.rows[r].cells[c].classList.add(`field-cell--${board[r][c]}`);
      }
    }
  }

  isGameOver();
  document.querySelector('.game-score').innerText = score;
};

function clearZero(row) {
  return row.filter(r => r !== 0);
}

function slide(row) {
  let toMergeRow = clearZero(row);

  for (let i = 0; i < toMergeRow.length - 1; i++) {
    if (toMergeRow[i] === toMergeRow[i + 1]) {
      toMergeRow[i] *= 2;
      toMergeRow[i + 1] = 0;
      score += toMergeRow[i];
    }
  }

  toMergeRow = clearZero(toMergeRow);

  while (toMergeRow.length < rows) {
    toMergeRow.push(0);
  }

  return toMergeRow;
};

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowUp':
      moveUp();

      break;

    case 'ArrowDown':
      moveDown();
      break;
  }

  setGame();
  setGame();
  updateGame();
});

function moveLeft() {
  for (let i = 0; i < rows; i++) {
    let row = board[i];

    row = slide(row);
    board[i] = row;
  }
};

function moveRight() {
  for (let i = 0; i < rows; i++) {
    let row = board[i];

    row.reverse();
    row = slide(row);
    board[i] = row.reverse();
  }
};

function moveDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];

    for (let i = 0; i < rows; i++) {
      board[i][c] = row[i];
    };
  }
};

function moveUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];

    for (let i = 0; i < rows; i++) {
      board[i][c] = row[i];
    }
  }
};
