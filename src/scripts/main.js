'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
import Game from '../modules/Game.class';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const buttonElement = document.querySelector('.button');
const cellsElements = document.querySelectorAll('.field-cell');
const messageStartElement = document.querySelector('.message-start');
const messageWinElement = document.querySelector('.message-win');
const messageLoseElement = document.querySelector('.message-lose');

function renderBoard() {
  scoreElement.textContent = `${game.getScore()}`;

  const board = game.getState();
  let cellIndex = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cellValue = board[row][col];
      const htmlCell = cellsElements[cellIndex];

      if (cellValue !== 0) {
        htmlCell.textContent = cellValue;
      } else {
        htmlCell.textContent = '';
      }
      cellIndex++;

      htmlCell.className = 'field-cell';

      if (cellValue !== 0) {
        htmlCell.classList.add(`field-cell--${cellValue}`);
      }
    }
  }
}

function statusMessage() {
  messageWinElement.classList.add('hidden');
  messageLoseElement.classList.add('hidden');

  if (game.getStatus() === 'win') {
    messageWinElement.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLoseElement.classList.remove('hidden');
  }
}

buttonElement.addEventListener('click', () => {
  if (buttonElement.classList.contains('start')) {
    game.start();
  } else {
    game.restart();
  }

  buttonElement.classList.remove('start');
  buttonElement.classList.add('restart');
  buttonElement.textContent = 'Restart';

  renderBoard();
  messageStartElement.classList.add('hidden');
  messageWinElement.classList.add('hidden');
  messageLoseElement.classList.add('hidden');
});

// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (event.key) {
    case 'ArrowUp':
    case 'w':
      game.moveUp();
      break;
    case 'ArrowDown':
    case 's':
      game.moveDown();
      break;
    case 'ArrowLeft':
    case 'a':
      game.moveLeft();
      break;
    case 'ArrowRight':
    case 'd':
      game.moveRight();
      break;
  }

  if (buttonElement.classList.contains('start')) {
    buttonElement.classList.remove('start');
    buttonElement.classList.add('restart');
    buttonElement.textContent = 'Restart';
  }
  statusMessage();
  renderBoard();
});
