'use strict';

const startButton = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const gameStatus = document.querySelector('.message-container');
const table = document.querySelector('.game-field');
const rows = table.rows;
let score = 0;
let startY;
let startX;
let moveY;
let moveX;

const gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function resetTheGame() {
  score = 0;

  for (let row = 0; row < gameField.length; row++) {
    for (let cell = 0; cell < gameField.length; cell++) {
      gameField[row][cell] = 0;
    }
  }
}

function changingDivMessage(value) {
  for (const child of gameStatus.children) {
    if (child.classList.contains(`message-${value}`)) {
      child.classList.remove('hidden');
    } else {
      child.classList.add('hidden');
    }
  }
}

function randomNumber() {
  let randomNum = Math.floor(Math.random() * (10 - 1) + 1);
  let randomRowIndex = Math.floor(Math.random() * (4));
  let randomColumnIndex = Math.floor(Math.random() * (4));

  while (gameField[randomRowIndex][randomColumnIndex] !== 0) {
    randomRowIndex = Math.floor(Math.random() * (4));
    randomColumnIndex = Math.floor(Math.random() * (4));
  }

  if (randomNum < 2) {
    randomNum = 4;
  } else {
    randomNum = 2;
  }

  gameField[randomRowIndex][randomColumnIndex] = randomNum;
}

function renderGameField() {
  gameScore.innerText = score;

  for (let x = 0; x < gameField.length; x++) {
    for (let y = 0; y < gameField.length; y++) {
      if (gameField[x][y] !== 0) {
        rows[x].children[y].className = 'field-cell';
        rows[x].children[y].innerText = gameField[x][y];

        if (gameField[x][y] > 2048) {
          rows[x].children[y].classList.add(`field-cell--2048`);
        } else {
          rows[x].children[y].classList.add(`field-cell--${gameField[x][y]}`);
        }
      } else {
        rows[x].children[y].className = 'field-cell';
        rows[x].children[y].innerText = '';
      }
    }
  }
}

function checkRowForGameOver(field) {
  let rowStatus = false;

  field.map(r => {
    return r.filter(digit => {
      for (let i = 0; i < gameField.length; i++) {
        if (r[i] === r[i + 1] || r[i] === 0) {
          rowStatus = true;

          return;
        }
      }
    });
  });

  return rowStatus;
}

function gameOver() {
  const columns = [];

  for (let r = 0; r < gameField.length; r++) {
    const transformToColumn = [
      gameField[0][r], gameField[1][r], gameField[2][r], gameField[3][r],
    ];

    columns.push(transformToColumn);
  }

  const checkRows = checkRowForGameOver(gameField);
  const checkColumns = checkRowForGameOver(columns);

  if (!checkRows && !checkColumns) {
    changingDivMessage('lose');

    return false;
  }

  return true;
}

function slidingSum(row, key) {
  let fieldRow = row.filter(digit => digit !== 0);

  if (key === 'ArrowRight' || key === 'ArrowDown') {
    fieldRow.reverse();
  }

  for (let cell = 0; cell < fieldRow.length; cell++) {
    if (fieldRow[cell] === fieldRow[cell + 1]) {
      fieldRow[cell] *= 2;
      fieldRow[cell + 1] = 0;
      score += fieldRow[cell];
    }
  }

  fieldRow = fieldRow.filter(digit => digit !== 0);

  while (fieldRow.length < gameField.length) {
    fieldRow.push(0);
  }

  return key === 'ArrowRight' || key === 'ArrowDown'
    ? fieldRow.reverse()
    : fieldRow;
}

function moveLeftAndRight(key) {
  for (let r = 0; r < gameField.length; r++) {
    let row = gameField[r];

    row = slidingSum(row, key);
    gameField[r] = row;
  }
}

function moveUpAndDown(key) {
  for (let r = 0; r < gameField.length; r++) {
    let transformRow = [
      gameField[0][r], gameField[1][r], gameField[2][r], gameField[3][r],
    ];

    transformRow = slidingSum(transformRow, key);

    for (let c = 0; c < gameField.length; c++) {
      gameField[c][r] = transformRow[c];
    }
  }
}

function simulateKeyPress(code) {
  document.dispatchEvent(new KeyboardEvent('keyup', { 'code': code }));
}

startButton.addEventListener('click', (e) => {
  if (startButton.classList.contains('start')) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.innerText = 'restart';
  }

  changingDivMessage('restart');
  resetTheGame();
  randomNumber();
  randomNumber();
  renderGameField();
});

document.addEventListener('keyup', (key) => {
  const lose = document.querySelector('.message-lose');

  if (startButton.classList.contains('start')) {
    return;
  }

  if (!lose.classList.contains('hidden')) {
    return;
  }

  const copyTableGame = JSON.parse(JSON.stringify(gameField));

  switch (key.code) {
    case 'ArrowLeft':
      moveLeftAndRight(key.code);
      break;

    case 'ArrowRight':
      moveLeftAndRight(key.code);
      break;

    case 'ArrowUp':
      moveUpAndDown(key.code);
      break;

    case 'ArrowDown':
      moveUpAndDown(key.code);
      break;
  }

  if (JSON.stringify(copyTableGame) === JSON.stringify(gameField)) {
    return;
  }

  randomNumber();

  renderGameField();

  const loseStatus = gameOver();

  if (!loseStatus) {
    changingDivMessage('lose');
  }
});

table.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startY = e.touches[0].clientY;
  startX = e.touches[0].clientX;
});

table.addEventListener('touchmove', (e) => {
  e.preventDefault();
  moveY = e.touches[0].clientY;
  moveX = e.touches[0].clientX;
});

table.addEventListener('touchend', (e) => {
  e.preventDefault();

  const endY = Math.abs(startY - moveY);
  const endX = Math.abs(startX - moveX);

  if ((startY - moveY) < 0 && endY > endX) {
    simulateKeyPress('ArrowDown');
  }

  if ((startY - moveY) > 0 && endY > endX) {
    simulateKeyPress('ArrowUp');
  }

  if ((startX - moveX) < 0 && endX > endY) {
    simulateKeyPress('ArrowRight');
  }

  if ((startX - moveX) > 0 && endX > endY) {
    simulateKeyPress('ArrowLeft');
  }
});
