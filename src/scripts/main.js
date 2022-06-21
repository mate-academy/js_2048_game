'use strict';

let board = [];
let score = 0;
const rows = 4;
const columns = 4;
const winLimit = 2048;

createMessage('Press "Start" to begin game. Good luck!', 'message-start');

function startGame() {
  setGame();
  createMessage('', 'hidden');
  createButton('Reset', 'restart');
};

function resetGame() {
  board.forEach(el => el.fill(0, 0, 4));
  score = 0;
  document.querySelector('.game-score').innerText = score;

  const cells = document.querySelectorAll('field-cell');

  cells.forEach(cell => cell.remove());

  createMessage('Press "Start" to begin game. Good luck!', 'message-start');
  createButton('Start', 'start');
}

document.querySelector('.start').addEventListener('click', () => {
  startGame();
});

function createButton(title, className) {
  document.querySelector('.button').remove();

  const button = document.createElement('button');

  button.classList.add('button');
  button.innerText = title;
  button.classList.add(className);

  button.addEventListener('click', className === 'restart'
    ? resetGame
    : startGame);

  document.querySelector('.controls').append(button);
};

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = document.createElement('field-cell');

      cell.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateCell(cell, num);
      document.getElementById('game-field').append(cell);
    }
  }

  setTwo();
  setTwo();
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
      board[r][c] = 2;

      const cell = document.getElementById(r.toString() + '-' + c.toString());

      cell.innerText = '2';
      cell.classList.add('field-cell--2');
      found = true;
    }
  }
}

function hasEmptyCell() {
  if (!board.length) {
    return;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (num > 0) {
    cell.innerText = num;

    if (num < winLimit) {
      cell.classList.add('field-cell' + '--' + +num.toString());
    } else {
      cell.classList.add('field-cell--2048');
    }
  }
}

document.addEventListener('keyup', (e) => {
  if (score >= winLimit) {
    createMessage('Winner! Congrats! You did it!', 'message-win');

    return;
  }

  setTwo();

  if (e.code === 'ArrowLeft') {
    slideLeft();
  } else if (e.code === 'ArrowRight') {
    slideRigth();
  } else if (e.code === 'ArrowUp') {
    slideUp();
  } else if (e.code === 'ArrowDown') {
    slideDown();
  }

  if (!canBeMergedVerticaly() && !canBeMergedHorisontaly() && !hasEmptyCell()) {
    createMessage('You lose! Restart the game?', 'message-lose');
  }

  document.querySelector('.game-score').innerText = score;
});

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
}

function slideRigth() {
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
}

function slide(r) {
  let row = filterZero(r);

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

function isMergingRow(r) {
  const row = filterZero(r);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      return true;
    }
  }

  return false;
}

function filterZero(row) {
  return row.filter(r => r);
}

function canBeMergedVerticaly() {
  const arr = [];
  const result = [];

  for (let col = 0; col < columns; col++) {
    arr.push([board[0][col], board[1][col], board[2][col], board[3][col]]);
  }

  arr.forEach(b => result.push(isMergingRow(b)));

  return result.some(el => el);
}

function canBeMergedHorisontaly() {
  const result = [];

  board.forEach(b => result.push(isMergingRow(b)));

  return result.some(el => el);
}

function createMessage(title, className) {
  if (document.querySelector('.message')) {
    document.querySelector('.message').remove();
  }

  const message = document.createElement('p');

  message.classList.add('message');
  message.innerText = title;
  message.classList.add(className);
  document.querySelector('.message-container').append(message);
}
