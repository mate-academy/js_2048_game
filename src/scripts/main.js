'use strict';

const tbody = document.querySelector('tbody');
const scoreField = document.querySelector('.game-score');

const btnReset = document.createElement('button');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

btnReset.classList.add('button');
btnReset.classList.add('restart');
btnReset.textContent = ('Restart');

const rows = tbody.rows.length;
const cells = rows;

let board;
let tempBoard;

let score = 0;

const matrix = [...tbody.children].map(row => [...row.children]);

function getStart() {
  btnStart.replaceWith(btnReset);

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;

  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  getRandomCell();
  getRandomCell();

  render();
}

function getRandomCell() {
  const [y, x] = findEmptyCell();

  board[y][x] = randomNumber();
}

function findEmptyCell() {
  const emptyCells = [];

  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell === 0) {
        emptyCells.push([rowIndex, cellIndex]);
      }
    });
  });

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

const btnStart = document.querySelector('.start');

function randomNumber() {
  return Math.random() >= 0.9 ? 4 : 2;
}

function slideHorizontally(direction) {
  for (let row = 0; row < rows; row++) {
    const newRow = board[row].filter(cell => cell !== 0);

    if (newRow.length !== 4) {
      if (direction === 'right') {
        do {
          newRow.unshift(0);
        } while (newRow.length < 4);
      } else {
        do {
          newRow.push(0);
        } while (newRow.length < 4);
      }
    }
    board.push(newRow);
  }

  board = board.slice(-4);

  toMerge(direction);
  check();

  toUpdateBoard();
}

function slideVertically(direction) {
  for (let row = 0; row < rows; row++) {
    const newRow = [];

    for (let cell = 0; cell < cells; cell++) {
      newRow.push(board[cell][row]);
    }

    const newClmnDirection = newRow.filter(elem => elem !== 0);

    if (newClmnDirection.length !== cells) {
      if (direction === 'down') {
        do {
          newClmnDirection.unshift(0);
        } while (newClmnDirection.length < cells);
      } else {
        do {
          newClmnDirection.push(0);
        } while (newClmnDirection.length < cells);
      }
    }

    for (let cell = 0; cell < cells; cell++) {
      board[cell][row] = newClmnDirection[cell];
    }
  }

  toMerge(direction);
  check();

  toUpdateBoard();
}

function toUpdateBoard() {
  if (JSON.stringify(tempBoard) !== JSON.stringify(board)) {
    getRandomCell();
  }

  render();
}

function toUpdateCell([row, cell], [cellMerged, rowMerged]) {
  tempBoard = JSON.parse(JSON.stringify(board));

  board[row][cell] *= 2;
  board[rowMerged][cellMerged] = 0;

  score += board[row][cell];
}

function toMerge(direction) {
  if (direction === 'left' || direction === 'right') {
    board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (direction === 'left' && cell === row[cellIndex + 1] && cell > 0) {
          toUpdateCell([rowIndex, cellIndex], [cellIndex + 1, rowIndex]);
        }

        if (direction === 'right' && cell === row[cellIndex - 1] && cell > 0) {
          toUpdateCell([rowIndex, cellIndex], [cellIndex - 1, rowIndex]);
        }
      });
    });
  }

  if (direction === 'down' || direction === 'up') {
    if (direction === 'down') {
      for (let row = rows - 1; row > 0; row--) {
        for (let cell = 0; cell < cells; cell++) {
          const currentCell = board[row][cell];

          if (currentCell === board[row - 1][cell] && currentCell > 0) {
            toUpdateCell([row, cell], [cell, row - 1]);
          }
        }
      }
    }

    if (direction === 'up') {
      for (let row = 0; row < rows - 1; row++) {
        for (let cell = 0; cell < cells; cell++) {
          const currentCell = board[row][cell];

          if (currentCell === board[row + 1][cell] && currentCell > 0) {
            toUpdateCell([row, cell], [cell, row + 1]);
          }
        }
      }
    }
  }
}

function render() {
  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const elem = matrix[rowIndex][cellIndex];

      scoreField.textContent = score;

      elem.classList = 'field-cell';

      if (cell === 0) {
        elem.innerText = '';
      } else {
        elem.innerText = cell;
        elem.classList.add(`field-cell--${cell}`);
      }
    });
  });

  tempBoard = JSON.parse(JSON.stringify(board));
}

function check() {
  const isLose = board.flat().every(cell => cell > 0);

  for (const row of board) {
    for (const cell of row) {
      if (cell === 2048) {
        messageWin.classList.remove('hidden');
        messageStart.classList.add('hidden');
      }
    }
  }

  if (isLose) {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
  }
}

document.addEventListener('click', (e) => {
  e.preventDefault();

  if (e.target === btnStart || e.target === btnReset) {
    getStart();
  }
});

document.addEventListener('keyup', (e) => {
  e.preventDefault();

  switch (e.code) {
    case 'ArrowLeft':
      slideHorizontally('left');
      break;
    case 'ArrowRight':
      slideHorizontally('right');
      break;

    case 'ArrowUp':
      slideVertically('up');
      break;
    case 'ArrowDown':
      slideVertically('down');
      break;

    default:
      break;
  }
});
