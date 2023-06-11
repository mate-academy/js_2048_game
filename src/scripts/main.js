'use strict';

let gameField;
let score = 0;
let change;

const button = document.querySelector('button');
const startMessages = document.querySelector('.message-start');
const loseMessages = document.querySelector('.message-lose');
const winMessages = document.querySelector('.message-win');
const elementScore = document.querySelector('.game-score');

// create empty array 4 x 4 | start GameField
function createField() {
  const field = [];

  for (let i = 0; i < 4; i++) {
    field.push([0, 0, 0, 0]);
  }

  return field;
}

// fill Game Field after each steps and cell added
function fillGameField(board) {
  const cells = document.querySelectorAll('.field-cell');
  let count = 0;

  board.flat().forEach((item, i) => {
    if (item) {
      cells[i].textContent = item;
      cells[i].className = `field-cell field-cell--${item}`;

      if (item === 2048) {
        winMessages.classList.remove('hidden');
      }

      count++;
    } else {
      cells[i].textContent = '';
      cells[i].className = 'field-cell';
    }
  });

  let stopGame = true;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === board[i][j + 1]) {
        stopGame = false;
      }

      if (i < 3 && board[i][j] === board[i + 1][j]) {
        stopGame = false;
      }
    }
  }

  if (count === 16 && stopGame === true) {
    document.removeEventListener('keydown', keyPress);
    loseMessages.classList.remove('hidden');
  }
}

function addCell(board) {
  let row, col;

  do {
    row = Math.floor(Math.random() * 4);
    col = Math.floor(Math.random() * 4);
  } while (board[row][col]);

  board[row][col] = Math.random() < 0.9 ? 2 : 4;
}

function stepX(board, reverse = false) {
  change = false;

  for (let i = 0; i < 4; i++) {
    let row = board[i].filter(el => el !== 0);

    row = reverse ? row.reverse() : row;

    for (let j = 0; j < row.length; j++) {
      if (row[j] === row[j + 1]) {
        row[j] *= 2;
        score += row[j];
        elementScore.innerText = score;
        row[j + 1] = 0;
      }
    }

    row = row.filter(el => el !== 0);
    row = [...row, 0, 0, 0, 0];
    row.length = 4;
    row = reverse ? row.reverse() : row;

    if (row.toString() !== board[i].toString()) {
      board[i] = row;
      change = true;
    }
  }

  return board;
}

function stepY(board, reverse = false) {
  let rotateBoard = createField();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      rotateBoard[3 - j][i] = board[i][j];
    }
  }

  rotateBoard = stepX(rotateBoard, reverse);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      board[i][j] = rotateBoard[3 - j][i];
    }
  }

  return board;
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.textContent = 'Restart';
    button.className = 'button restart';
    startMessages.hidden = true;
  } else {
    score = 0;
    elementScore.innerText = score;
    loseMessages.classList.add('hidden');
    document.removeEventListener('keydown', keyPress);
  }

  gameField = createField();

  addCell(gameField);
  addCell(gameField);
  fillGameField(gameField);

  document.addEventListener('keydown', keyPress);
});

const keyPress = (e) => {
  if (e.code === 'ArrowLeft') {
    fillGameField(stepX(gameField));
  }

  if (e.code === 'ArrowRight') {
    fillGameField(stepX(gameField, true));
  }

  if (e.code === 'ArrowUp') {
    fillGameField(stepY(gameField));
  }

  if (e.code === 'ArrowDown') {
    fillGameField(stepY(gameField, true));
  }

  if (change) {
    addCell(gameField);
    setTimeout(() => fillGameField(gameField), 200);
  }
};
