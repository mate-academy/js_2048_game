'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

function getCells() {
  return document.querySelectorAll('.field-cell');
}

function renderBoard() {
  const state = game.getState();
  const cells = getCells();
  let i = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = cells[i++];
      const val = state[r][c];

      cell.className = 'field-cell';

      if (val > 0) {
        cell.textContent = val;
        cell.classList.add(`field-cell--${val}`);
      } else {
        cell.textContent = '';
      }
    }
  }

  scoreEl.textContent = game.getScore();
}

function updateMessages() {
  const gameStatus = game.getStatus();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

startBtn.addEventListener('click', () => {
  if (startBtn.classList.contains('start')) {
    game.start();
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
    startMessage.classList.add('hidden');
  } else {
    game.restart();
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    startBtn.classList.remove('restart');
    startBtn.classList.add('start');
    startBtn.textContent = 'Start';
    startMessage.classList.remove('hidden');
  }

  renderBoard();
  updateMessages();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
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
    default:
      return;
  }

  renderBoard();
  updateMessages();
});
