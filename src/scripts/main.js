'use strict';

const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const rows = 4;
const columns = 4;

let isMoved = false;
let gameOver;

let score = 0;
const winValue = 2048;

document.querySelector('.game-score').innerText = score;

const directions = {
  Left: 'ArrowLeft',
  Right: 'ArrowRight',
  Down: 'ArrowDown',
  Up: 'ArrowUp',
};

window.onload = () => (setField());

function setField() {
  isMoved = false;
  gameOver = false;

  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < columns; cell++) {
      const field = document.createElement('div');

      field.id = row.toString() + '-' + cell.toString();

      const num = board[row][cell];

      update(field, num);

      document.getElementById('board').append(field);
    }
  }
};

function startGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  isMoved = false;
  gameOver = false;
  score = 0;
  document.querySelector('.game-score').innerText = score;

  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < columns; cell++) {
      const field
        = document.getElementById(row.toString() + '-' + cell.toString());

      field.id = row.toString() + '-' + cell.toString();
      update(field, 0);
    }
  }

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  startButton.classList.add('hidden');
  restartButton.classList.remove('hidden');

  appendNewCell();
  appendNewCell();
};

function appendNewCell() {
  let appended = false;
  const random = Math.random();
  const cellNumber = random <= 0.1 ? 4 : 2;

  while (!appended) {
    const row = Math.floor(Math.random() * rows);
    const column = Math.floor(Math.random() * columns);

    if (board[row][column] === 0) {
      board[row][column] = cellNumber;

      const field
        = document.getElementById(row.toString() + '-' + column.toString());

      field.classList.add('field-cell--' + cellNumber.toString());
      field.innerText = cellNumber.toString();

      appended = true;
    }
  }
};

function update(field, num) {
  field.innerText = '';
  field.classList = '';
  field.classList.add('field-cell');

  if (num > 0) {
    field.innerText = num;

    if (num <= 2048) {
      field.classList.add('field-cell--' + num.toString());
    } else {
      field.classList.add('field-cell--2048');
    }
  }
};

function slide(row) {
  const initialRow = row.slice();

  let filteredRow = row.filter(num => num !== 0);

  for (let i = 0; i < filteredRow.length - 1; i++) {
    if (filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      filteredRow[i + 1] = 0;
      score += filteredRow[i];
      isMoved = true;
    }
  }

  document.querySelector('.game-score').innerText = score;

  filteredRow = filteredRow.filter(num => num !== 0);

  if (filteredRow.length < columns) {
    while (filteredRow.length < columns) {
      filteredRow.push(0);
    }
  }

  for (let i = 0; i < filteredRow.length; i++) {
    if (filteredRow[i] !== initialRow[i]) {
      isMoved = true;
    }
  }

  return filteredRow;
};

function slideLeft() {
  if (!gameOver) {
    for (let r = 0; r < rows; r++) {
      let row = board[r];

      row = slide(row);

      board[r] = row;

      for (let c = 0; c < columns; c++) {
        const field
          = document.getElementById(r.toString() + '-' + c.toString());
        const num = board[r][c];

        update(field, num);
      }
    }

    if (isMoved) {
      appendNewCell();
      isMoved = false;
    }

    checkGameOver();
  }
};

function slideRight() {
  if (!gameOver) {
    for (let r = 0; r < rows; r++) {
      let row = board[r];

      row.reverse();
      row = slide(row);
      row.reverse();

      board[r] = row;

      for (let c = 0; c < columns; c++) {
        const field
          = document.getElementById(r.toString() + '-' + c.toString());
        const num = board[r][c];

        update(field, num);
      }
    }

    if (isMoved) {
      appendNewCell();
      isMoved = false;
    }

    checkGameOver();
  }
};

function slideUp() {
  if (!gameOver) {
    for (let c = 0; c < columns; c++) {
      let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

      row = slide(row);

      for (let r = 0; r < rows; r++) {
        board[r][c] = row[r];

        const field
          = document.getElementById(r.toString() + '-' + c.toString());
        const num = board[r][c];

        update(field, num);
      }
    }

    if (isMoved) {
      appendNewCell();
      isMoved = false;
    }

    checkGameOver();
  }
};

function slideDown() {
  if (!gameOver) {
    for (let c = 0; c < columns; c++) {
      let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

      row.reverse();
      row = slide(row);
      row.reverse();

      for (let r = 0; r < rows; r++) {
        board[r][c] = row[r];

        const field
          = document.getElementById(r.toString() + '-' + c.toString());
        const num = board[r][c];

        update(field, num);
      }
    }

    if (isMoved) {
      appendNewCell();
      isMoved = false;
    }

    checkGameOver();
  }
};

function checkGameOver() {
  let lose = false;
  let win = false;
  const zeros = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === winValue) {
        win = true;
      }

      if (board[r][c] === 0) {
        zeros.push(0);
      }
    }
  }

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < columns - 1; c++) {
      const currentValue = board[r][c];

      if (
        (r > 0 && board[r - 1][c] === currentValue)
        || (r < rows - 1 && board[r + 1][c] === currentValue)
        || (c > 0 && board[r][c - 1] === currentValue)
        || (c < columns - 1 && board[r][c + 1] === currentValue)
      ) {
        lose = false;
        break;
      } else {
        lose = true;
      }
    }

    if (!lose) {
      break;
    }
  }

  if (lose && zeros.length === 0) {
    loseMessage.classList.remove('hidden');
    gameOver = true;

    return;
  }

  if (win) {
    winMessage.classList.remove('hidden');
    gameOver = true;
  }
}

startButton.addEventListener('click', () => {
  startGame();
});

restartButton.addEventListener('click', () => {
  startGame();
});

document.addEventListener('keyup', (e) => {
  if (e.code === directions.Left) {
    slideLeft();
  }

  if (e.code === directions.Right) {
    slideRight();
  }

  if (e.code === directions.Up) {
    slideUp();
  }

  if (e.code === directions.Down) {
    slideDown();
  }
});
