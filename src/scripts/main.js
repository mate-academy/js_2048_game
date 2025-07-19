'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

import Game from '../modules/Game.class';

const game = new Game();

const startBtn = document.querySelector('.start');
const scoreDisplay = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

startBtn.addEventListener('click', () => {
  game.start();
  updateBoard();
  updateScore();
  showMessage('playing');
});

function updateBoard() {
  const board = game.getState();
  let index = 0;

  for (const row of board) {
    for (const cell of row) {
      const td = cells[index];

      td.textContent = cell !== 0 ? cell : '';
      td.className = 'field-cell';

      if (cell !== 0) {
        td.classList.add(`field-cell--${cell}`);
      }
      index++;
    }
  }
}

function updateScore() {
  scoreDisplay.textContent = game.getScore();
}

function showMessage(gameStatus) {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (evt) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (evt.key) {
    case 'ArrowLeft':
      game.moveBoardLeft();
      break;
    case 'ArrowRight':
      game.moveBoardRight();
      break;
    case 'ArrowUp':
      game.moveBoardUp();
      break;
    case 'ArrowDown':
      game.moveBoardDown();
      break;
    default:
      return;
  }

  updateBoard();
  updateScore();
  showMessage(game.getStatus());
});
