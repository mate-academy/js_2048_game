'use strict';

let valueBoard;
const rows = 4;
const columns = 4;
let score = 0;

const buttonStart = document.querySelector('.start');
const fieldRows = document.querySelectorAll('tr');
const cells = document.querySelectorAll('td');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const board = [];

[...fieldRows].forEach(row => {
  const cell = row.querySelectorAll('td');

  board.push(cell);
});

function setGame() {
  valueBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  addNumber();
  addNumber();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < rows; j++) {
      const number = valueBoard[i][j];

      updateCell(board[i][j], number);
    }
  }
}

function updateCell(cell, num) {
  cell.classList.value = `field-cell`;

  if (num > 0) {
    cell.textContent = num;
    cell.classList.add(`field-cell--${num}`);
  } else if (num === 0) {
    cell.textContent = '';
  }
}

function createRandomNumber(num) {
  return Math.floor(Math.random() * num);
}

function addNumber() {
  if (!hasEmptyCell()) {
    return;
  }

  let activeCell = false;

  while (!activeCell) {
    const r = createRandomNumber(rows);
    const c = createRandomNumber(columns);

    if (valueBoard[r][c] === 0) {
      const num = Math.random() <= 0.1 ? 4 : 2;

      valueBoard[r][c] = num;
      board[r][c].textContent = num;
      board[r][c].classList.add(`field-cell--${num}`);
      activeCell = true;
    }
  }
};

function hasEmptyCell() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (valueBoard[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
};

document.addEventListener('click', (ev) => {
  if (ev.target.closest('.start')) {
    messageStart.classList.add(`hidden`);
    buttonStart.textContent = 'Restart';
    buttonStart.classList.add(`restart`);
    buttonStart.classList.remove(`start`);
    setGame();

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowRight':
          moveRight();
          addNumber();
          break;
        case 'ArrowLeft':
          moveLeft();
          addNumber();
          break;
        case 'ArrowDown':
          moveDown();
          addNumber();
          break;
        case 'ArrowUp':
          moveUp();
          addNumber();
          break;
        default:
          return;
      }

      [...cells].forEach(cell => {
        if (cell.textContent === '2048') {
          messageWin.classList.remove(`hidden`);

          setTimeout(() => {
            document.location.reload();
          }, 2000);
        }
      });

      if (!hasEmptyCell() && !hasAdjacentSameNumbers(valueBoard)) {
        messageLose.classList.remove(`hidden`);
      }

      document.querySelector('.game-score').textContent = score;
    });
  } else if (ev.target.closest('.restart')) {
    setGame();
    score = 0;
  }
});

function hasAdjacentSameNumbers(data) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (i < rows - 1 && data[i][j] === data[i + 1][j]) {
        return true;
      } else if (j < columns - 1 && data[i][j] === data[i][j + 1]) {
        return true;
      }
    }
  }

  return false;
}

function filterZero(y) {
  const newRow = y.filter(num => num !== 0);

  return newRow;
}

function move(data) {
  let row = filterZero(data);

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

function moveLeft() {
  for (let r = 0; r < rows; r++) {
    let row = valueBoard[r];

    row = move(row);
    valueBoard[r] = row;

    for (let c = 0; c < columns; c++) {
      const number = valueBoard[r][c];

      updateCell(board[r][c], number);
    }
  }
};

function moveRight() {
  for (let r = 0; r < rows; r++) {
    let row = valueBoard[r];

    row.reverse(); ;
    row = move(row);
    valueBoard[r] = row.reverse(); ;

    for (let c = 0; c < columns; c++) {
      const number = valueBoard[r][c];

      updateCell(board[r][c], number);
    }
  }
};

function moveUp() {
  for (let c = 0; c < columns; c++) {
    let column = [valueBoard[0][c], valueBoard[1][c],
      valueBoard[2][c], valueBoard[3][c]];

    column = move(column);

    for (let r = 0; r < columns; r++) {
      valueBoard[r][c] = column[r];

      const number = valueBoard[r][c];

      updateCell(board[r][c], number);
    }
  }
}

function moveDown() {
  for (let c = 0; c < columns; c++) {
    let column = [valueBoard[3][c], valueBoard[2][c],
      valueBoard[1][c], valueBoard[0][c]];

    column = move(column);
    column.reverse();

    for (let r = 0; r < columns; r++) {
      valueBoard[r][c] = column[r];

      const number = valueBoard[r][c];

      updateCell(board[r][c], number);
    }
  }
}
