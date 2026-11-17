/* eslint-disable max-len */
'use strict';
import Game from '../modules/Game.class.js';

const game = new Game();

const button = document.querySelector('.button');
const scroleElement = document.querySelector('.game-score');
const cells = document.querySelector('.field-cell');

const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

function renderBoard() {
  const state = game.getState();

  state.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const cellIndex = rowIndex * 4 + columnIndex;
      const cell = cells[cellIndex];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });
}

const handleStart = () => {
  const currentStatus = game.getStatus();

  if (currentStatus === 'idle') {
    game.start();
    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
    startMessage.classList.add('hidden');
    // winMessage.classList.add('hidden');
    // loseMessage.classList.add('hidden');
  }

  if (currentStatus === 'playing') {
    game.restart();
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }

  const newStatus = game.getStatus();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (newStatus === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (newStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
};

button.addEventListener('click', handleStart);

document.addEventListener('keydown', (event) => {
  // слухати подію keydown перевіряти event.key і викликати відповідний метод екземпляра
  switch (event.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }

  const cell = document.querySelector('.field-cell');
  cell.classList.add('field-cell--2');

  function renderBoard() {
    const state = game.getState();
    const cells = document.querySelectorAll('.field-cell');
    state.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {
        const cellIndex = rowIndex * 4 + columnIndex;
        const cell = cells[cellIndex];
        cell.textContent = value === 0 ? '' : value;
        cell.className = 'field-cell';

        if (value !== 0) {
          cell.classList.add(`field-cell--${value}`);
        }
      });
    });
  }
});

export default Game;
