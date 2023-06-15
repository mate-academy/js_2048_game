'use strict';

const gameFieldRows = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let score = 0;
let gameField = clearField();

function clearField() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

startButton.addEventListener('click', () => {
  document.addEventListener('keyup', arrowsChecker);
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (startButton.innerText === 'Start') {
    startButton.innerText = 'Restart';
    startButton.classList.replace('start', 'restart');
    startMessage.hidden = true;
  } else {
    gameField = clearField();
    score = 0;
  }

  cellFilling();
  cellFilling();
  gameFieldFilling();
});

function cellFilling() {
  const randomRow = Math.floor(Math.random() * 4);
  const randomCell = Math.floor(Math.random() * 4);

  (gameField[randomRow][randomCell] === 0)
    ? gameField[randomRow][randomCell]
      = (Math.floor(Math.random() * 100) < 10 ? 4 : 2)
    : cellFilling();
}

function gameFieldFilling() {
  for (let row = 0; row < 4; row++) {
    for (let cell = 0; cell < 4; cell++) {
      gameFieldRows[row].children[cell].innerText
        = gameField[row][cell] || '';

      gameFieldRows[row].children[cell].className
        = `field-cell field-cell--${gameField[row][cell]}`;

      if (gameField[row][cell] === 2048) {
        document.removeEventListener('keyup', arrowsChecker);
        winMessage.classList.remove('hidden');
      }
    }
  }

  gameScore.innerText = score;
  loseCheck();
}

function loseCheck() {
  let gameOver = true;
  const transposedField = transpose([...gameField]);
  const zeroChecker = gameField.some(cell => cell.includes(0));

  for (let row = 0; row < 4; row++) {
    for (let cell = 0; cell < 3; cell++) {
      if (gameField[row][cell] === gameField[row][cell + 1]
        || transposedField[row][cell] === transposedField[row][cell + 1]) {
        gameOver = false;
      }
    }
  }

  if (gameOver && !zeroChecker) {
    document.removeEventListener('keyup', arrowsChecker);
    loseMessage.classList.remove('hidden');
  }
}

function transpose(arr) {
  return arr.map((value, column) => arr.map(row => row[column]));
}

function zeroRemover(arr) {
  return arr.filter(value => value !== 0);
}

function rowMerge(row) {
  for (let i = 0; i < row.length; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  zeroRemover(row);

  while (row.length < 4) {
    row.push(0);
  }

  return row;
}

function arrowRight() {
  for (let row = 0; row < 4; row++) {
    const cells = gameField[row].reverse().filter(num => num);

    rowMerge(cells);
    gameField[row] = cells.reverse();
  }
}

function arrowLeft() {
  for (let row = 0; row < 4; row++) {
    const cells = gameField[row].filter(num => num);

    rowMerge(cells);
    gameField[row] = cells;
  }
}

function arrowUp() {
  gameField = transpose(gameField);
  arrowLeft();
  gameField = transpose(gameField);
}

function arrowDown() {
  gameField = transpose(gameField);
  arrowRight();
  gameField = transpose(gameField);
}

function arrowsChecker(e) {
  switch (e.key) {
    case 'ArrowRight':
      arrowRight();
      cellFilling();
      gameFieldFilling();
      break;

    case 'ArrowLeft':
      arrowLeft();
      cellFilling();
      gameFieldFilling();
      break;

    case 'ArrowUp':
      arrowUp();
      cellFilling();
      gameFieldFilling();
      break;

    case 'ArrowDown':
      arrowDown();
      cellFilling();
      gameFieldFilling();
      break;
  }
}
