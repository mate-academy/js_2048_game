'use strict';

const gameRows = document.querySelectorAll('.field-row');
const startBtn = document.querySelector('.start');
const scoreElem = document.querySelector('.game-score');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLoss = document.querySelector('.message-lose');

const rowsCount = gameRows.length;
const winCondition = 2048;

let gameField;
let score;

const updateUI = (row, col, num) => {
  const element = gameRows[row].children[col];
  const number = num || gameField[row][col];

  element.innerText = number > 0 ? number : '';
  element.classList.value = '';
  element.classList.add(`field-cell--${number}`, 'field-cell');

  if (number === winCondition) {
    msgWin.classList.remove('hidden');
    document.removeEventListener('keydown', gameHandler);
  }
};

const resetGame = () => {
  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLoss.classList.add('hidden');

  gameField.forEach((row, rowIndex) => {
    row.forEach((_, colIndex) => updateUI(rowIndex, colIndex));
  });
};

const setRandom = () => {
  const emptyFields = [];

  for (let row = 0; row < rowsCount; row++) {
    for (let col = 0; col < rowsCount; col++) {
      if (gameField[row][col] === 0) {
        emptyFields.push([row, col]);
      }
    }
  }

  if (emptyFields.length > 0) {
    // eslint-disable-next-line
    const [row, col] = emptyFields[Math.trunc(Math.random() * emptyFields.length)];
    const randomNum = Math.random() <= 0.1 ? 4 : 2;

    gameField[row][col] = randomNum;

    updateUI(row, col, randomNum);
  }
};

const merge = (row, reversed = false) => {
  const prepared = reversed ? row.reverse() : row;
  let filtered = prepared.filter(n => n !== 0);

  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      filtered[i + 1] = 0;
      score += filtered[i];
    }
  }

  filtered = filtered.filter(n => n !== 0);
  scoreElem.innerText = score;

  const resRow = filtered.concat(Array(rowsCount - filtered.length).fill(0));

  return reversed ? resRow.reverse() : resRow;
};

const sortRow = (reversed = false) => {
  for (let col = 0; col < rowsCount; col++) {
    const mappedRow = gameField.map(el => el[col]);
    const mergedRow = merge(mappedRow, reversed);

    for (let row = 0; row < rowsCount; row++) {
      gameField[row][col] = mergedRow[row];

      updateUI(row, col);
    }
  }

  setRandom();
};

const sortCol = (reversed = false) => {
  for (let row = 0; row < rowsCount; row++) {
    const currentRow = gameField[row];
    const mergedRow = merge(currentRow, reversed);

    gameField[row] = mergedRow;

    for (let col = 0; col < rowsCount; col++) {
      updateUI(row, col);
    }
  }

  setRandom();
};

const checkForLose = () => {
  const hasEmpty = gameField.some(arr => arr.some(el => el === 0));

  if (hasEmpty) {
    return;
  }

  for (let row = 0; row < rowsCount; row++) {
    for (let col = 0; col < rowsCount - 1; col++) {
      if (gameField[row][col] === gameField[row][col + 1]
        || gameField[col][row] === gameField[col + 1][row]) {
        return;
      }
    }
  }

  msgLoss.classList.remove('hidden');
  document.removeEventListener('keydown', gameHandler);
};

const gameHandler = (keyEvent) => {
  switch (keyEvent.key) {
    case 'ArrowUp':
      sortRow();
      break;

    case 'ArrowDown':
      sortRow(true);
      break;

    case 'ArrowLeft':
      sortCol();
      break;

    case 'ArrowRight':
      sortCol(true);
      break;

    default:
      break;
  }

  checkForLose();
};

startBtn.addEventListener('click', () => {
  startBtn.innerText = 'Reset';
  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
  resetGame();
  setRandom();
  setRandom();

  document.addEventListener('keydown', gameHandler);
});
