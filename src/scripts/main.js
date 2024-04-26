'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;

const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');

startButton.addEventListener('click', () => {
  setGame();
  setTwo();
  setTwo();
  messageStart.classList.add('hidden');
});

window.onload = function() {
  setGame();
};

function setGame() {
  const gameField = document.getElementsByClassName('game-field')[0];

  while (gameField.firstChild) {
    gameField.removeChild(gameField.firstChild);
  }

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = document.createElement('div');

      cell.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateCell(cell, num);
      document.getElementsByClassName('game-field')[0].append(cell);
    }
  }
}

function hasEmptyCell() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function setTwo() {
  if (!hasEmptyCell()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      const num = Math.random() <= 0.1 ? 4 : 2;

      board[r][c] = num;

      const cell = document.getElementById(r.toString() + '-' + c.toString());

      cell.innerText = num.toString();
      cell.classList.add(`field-cell--${num}`);
      found = true;
    }
  }
}

function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (num > 0) {
    cell.innerText = num;

    if (num <= 1024) {
      cell.classList.add(`field-cell--${num}`);
    } else {
      cell.classList.add('field-cell--2048');
    }
  }
}

function checkWin() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 2048) {
        const messageWin = document.querySelector('.message-win');

        messageWin.classList.remove('hidden');

        return;
      }
    }
  }
}

function checkGameOver() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return false;
      }

      if (c < columns - 1 && board[r][c] === board[r][c + 1]) {
        return false;
      }

      if (r < rows - 1 && board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  const messageGameOver = document.querySelector('.message-lose');

  messageGameOver.classList.remove('hidden');

  return true;
}

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      slideLeft();
      setTwo();
      break;

    case 'ArrowRight':
      slideRight();
      setTwo();
      break;

    case 'ArrowUp':
      slideUp();
      setTwo();
      break;

    case 'ArrowDown':
      slideDown();
      setTwo();
      break;
  }

  startButton.innerText = 'Restart';
  document.getElementsByClassName('game-score')[0].innerText = score;
});

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function slide(inputRow) {
  let row = [...inputRow];

  row = filterZero(row);

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

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateCell(cell, num);
    }
  }

  checkWin();
  checkGameOver();
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();

    row = slide(row);

    row.reverse();

    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateCell(cell, num);
    }
  }

  checkWin();
  checkGameOver();
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateCell(cell, num);
    }
  }

  checkWin();
  checkGameOver();
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateCell(cell, num);
    }
  }

  checkWin();
  checkGameOver();
}
