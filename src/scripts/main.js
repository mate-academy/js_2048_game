/* eslint-disable no-unused-vars */
'use strict';

const startButton = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const field = document.querySelector('.game-field');
const score = document.querySelector('.game-score');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const allMessages = document.querySelectorAll('.message');

const gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  }

  for (let r = 0; r < gameField.length; r++) {
    for (let c = 0; c < gameField[r].length; c++) {
      gameField[r][c] = 0;
    }
  }

  [...cells].map(cell => {
    cell.className = 'field-cell';
    cell.textContent = '';
  });

  [...allMessages].map(message => message.classList.add('hidden'));

  score.textContent = 0;

  addRandomCell();
  addRandomCell();
  renderGame();
});

function getRandomValue() {
  let value = 2;
  const randomPercent = Math.floor(Math.random() * 100);

  if (randomPercent >= 90) {
    value = 4;
  }

  return value;
}

function addRandomCell() {
  let row = Math.floor(Math.random() * 4);
  let cell = Math.floor(Math.random() * 4);

  while (gameField[row][cell] !== 0) {
    row = Math.floor(Math.random() * 4);
    cell = Math.floor(Math.random() * 4);
  }

  gameField[row][cell] = getRandomValue();
}

function renderGame() {
  for (let r = 0; r < gameField.length; r++) {
    const row = field.rows[r];

    for (let c = 0; c < gameField[r].length; c++) {
      const gameCell = row.cells[c];

      gameCell.className = 'field-cell';
      gameCell.textContent = '';

      if (gameField[r][c] !== 0) {
        gameCell.classList.add(`field-cell--${gameField[r][c]}`);
        gameCell.textContent = gameField[r][c];
      }
    }
  }
}
