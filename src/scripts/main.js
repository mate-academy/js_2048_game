'use strict';

const gameRows = document.querySelectorAll('.field-row');
const gameCells = document.querySelectorAll('.field-cell');
const startBtn = document.querySelector('.start');
const scoreElem = document.querySelector('.game-score');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLoss = document.querySelector('.message-lose');

const rowsCount = gameRows.length;

let gameField;
let score;

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
};

const updateUI = (elem, number = 0) => {
  const element = elem;

  element.innerText = number > 0 ? number : '';
  element.classList.value = '';
  element.classList.add(`field-cell--${number}`, 'field-cell');
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
    const randomElement = gameRows[row].children[col];

    gameField[row][col] = randomNum;

    updateUI(randomElement, randomNum);
  }
};

startBtn.addEventListener('click', () => {
  startBtn.innerText = 'Reset';
  startBtn.classList.toggle('start');
  startBtn.classList.toggle('restart');
  gameCells.forEach(cell => updateUI(cell));
  resetGame();
  setRandom();
  setRandom();
});

const merge = (row, reversed = false) => {
  const prepared = reversed ? row.reverse() : row;
  const filtered = prepared.filter(n => n !== 0);

  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2;
      filtered[i + 1] = 0;
      score += filtered[i];
    }
  }

  const resRow = filtered.concat(Array(rowsCount - filtered.length).fill(0));

  scoreElem.innerText = score;

  return reversed ? resRow.reverse() : resRow;
};

const sortRow = (reversed = false) => {
  for (let col = 0; col < rowsCount; col++) {
    const mappedRow = gameField.map(el => el[col]);

    const mergedRow = merge(mappedRow, reversed);

    for (let row = 0; row < rowsCount; row++) {
      gameField[row][col] = mergedRow[row];

      const elem = gameRows[row].children[col];
      const num = gameField[row][col];

      updateUI(elem, num);
    }
  }
};

document.addEventListener('keydown', (keyEvent) => {
  switch (keyEvent.key) {
    case 'ArrowUp':
      sortRow();
      break;

    case 'ArrowDown':
      sortRow(true);
      break;

    case 'ArrowRight':
      break;

    case 'ArrowLeft':
      break;

    default:
      break;
  }

  setRandom();
});
