'use strict';

const gameRows = document.querySelectorAll('.field-row');
// const startBtn = document.querySelector('.start');
// const scoreElem = document.querySelector('.game-score');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLoss = document.querySelector('.message-lose');
const rowsCount = gameRows.length;

let gameField;
// let score;

const resetGame = () => {
  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  // score = 0;
  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLoss.classList.add('hidden');
};

const updateUI = ([row, col], number) => {
  const element = gameRows[row].children[col];

  element.innerText = number;
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
    const random = emptyFields[Math.trunc(Math.random() * emptyFields.length)];
    const randomNum = Math.random() <= 0.1 ? 4 : 2;

    gameField[random[0]][random[1]] = randomNum;

    updateUI(random, randomNum);
  }
};

resetGame();
setRandom();
