'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

window.onload = function() {
  setGame();
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
      const fieldCell = document.createElement('div');
      const num = board[r][c];

      fieldCell.id = r.toString() + '-' + c.toString();
      updateFieldCell(fieldCell, num);
      gameField.append(fieldCell);
    }
  }
}

button.addEventListener('click', (e) => {
  if (button.classList.contains('start')) {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    startMessage.classList.add('hidden');

    setTwo();
    setTwo();
  } else {
    button.classList.replace('restart', 'start');
    button.innerText = 'Start';
    startMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');

    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const tile = document.getElementById(`${r}-${c}`);

        tile.innerText = '';
        tile.classList.value = '';
        tile.classList.add('field-cell');

        winMessage.classList.add('hidden');
      }
    }

    score = 0;
    gameScore.innerText = score;
  }
});

function hasEmptyFieldCell() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }
}

function achieve2048() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const fieldCell = document.getElementById(r.toString()
        + '-' + c.toString());

      if (fieldCell.innerText === '2048') {
        winMessage.classList.remove('hidden');
      }
    }
  }
}

function setTwo() {
  if (!hasEmptyFieldCell()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    const newNumber = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
    const el = Math.floor(Math.random() * 10);

    if (board[r][c] === 0) {
      board[r][c] = newNumber[el];

      const fieldCell = document.getElementById(r.toString()
        + '-' + c.toString());

      fieldCell.innerText = newNumber[el];
      fieldCell.classList.add('field-cell--' + newNumber[el].toString());
      found = true;
    }
  }
}

function updateFieldCell(fieldCell, num) {
  fieldCell.innerText = '';
  fieldCell.classList.value = '';
  fieldCell.classList.add('field-cell');

  if (num > 0) {
    fieldCell.innerText = num;

    num <= 2048
      ? fieldCell.classList.add('field-cell--' + num.toString())
      : fieldCell.classList.add('field-cell--2048');
  }
}

document.addEventListener('keyup', (e) => {
  if (startMessage.classList.contains('hidden')) {
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
      default:
        setTwo();
    }
    achieve2048();
    gameScore.innerText = score;

    if (!lastMove()) {
      loseMessage.classList.remove('hidden');
    }
  }
});

function slide(row) {
  let slideRow = row.filter(num => num !== 0);

  for (let i = 0; i < slideRow.length - 1; i++) {
    if (slideRow[i] === slideRow[i + 1]) {
      slideRow[i] *= 2;
      slideRow[i + 1] = 0;
      score += slideRow[i];
    }
  }
  slideRow = slideRow.filter(num => num !== 0);

  while (slideRow.length < columns) {
    slideRow.push(0);
  }

  return slideRow;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const fieldCell = document.getElementById(r.toString()
        + '-' + c.toString());
      const num = board[r][c];

      updateFieldCell(fieldCell, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);
    row.reverse();
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const fieldCell = document.getElementById(r.toString()
        + '-' + c.toString());
      const num = board[r][c];

      updateFieldCell(fieldCell, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[c];

      const fieldCell = document.getElementById(r.toString()
        + '-' + c.toString());
      const num = board[r][c];

      updateFieldCell(fieldCell, num);
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
      board[r][c] = row[c];

      const fieldCell = document.getElementById(r.toString()
        + '-' + c.toString());
      const num = board[r][c];

      updateFieldCell(fieldCell, num);
    }
  }
}

function lastMove() {
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c < columns; c++) {
      if (board[r][c - 1] === board[r][c]) {
        return true;
      }
    }
  }

  for (let c = 0; c < columns; c++) {
    for (let r = 1; r < rows; r++) {
      if (board[r - 1][c] === board[r][c]) {
        return true;
      }
    }
  }
}
