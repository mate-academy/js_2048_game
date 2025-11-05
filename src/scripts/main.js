'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.button');
const scoreField = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const boardCells = document.querySelectorAll('.field-cell');

function renderBoard() {
  const state = game.getState();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const index = i * 4 + j;
      const cell = boardCells[index];
      const value = state[i][j];

      cell.textContent = '';
      cell.className = 'field-cell';

      if (value > 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
  scoreField.textContent = game.getScore();
}

startBtn.addEventListener('click', () => {
  if (startBtn.textContent === 'Start') {
    messageStart.classList.add('hidden');

    game.start();
    renderBoard();
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  } else {
    game.restart();
    game.start();
    renderBoard();

    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    startBtn.textContent = 'Restart';
  }
});

document.addEventListener('keydown', (events) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (events.key) {
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
  renderBoard();

  const statusGame = game.getStatus();

  if (statusGame === 'win') {
    messageWin.classList.remove('hidden');
  } else if (statusGame === 'lose') {
    messageLose.classList.remove('hidden');
  }
});
