'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
import Game from '../modules/Game.class';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const start = document.querySelector('.button.start');
const score = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function showMessage(gameStatus) {
  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function render() {
  const board = game.getState();

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const index = i * 4 + j;
      const cell = cells[index];
      const value = board[i][j];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  score.textContent = game.getScore();
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  showMessage(game.getStatus());
}

function updateStartButton() {
  start.classList.remove('start');
  start.classList.add('restart');
  start.textContent = 'Restart';
  messageStart.classList.add('hidden');
}

start.addEventListener('click', () => {
  updateStartButton();
  game.start();
  render();
});

document.addEventListener('keydown', (e) => {
  updateStartButton();

  if (['win', 'lose'].includes(game.getStatus())) {
    return;
  }

  switch (e.key) {
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

  render();
});

render();
