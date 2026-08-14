'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const scoreEl = document.querySelector('.game-score');
const button = document.querySelector('.button.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const cells = document.querySelectorAll('.field-cell');

function renderBoard() {
  const state = game.getState();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = state[row][col];
      const cell = cells[row * 4 + col];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
}

function updateStatus() {
  scoreEl.textContent = game.getScore();

  const statusGame = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (statusGame === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (statusGame === 'win') {
    messageWin.classList.remove('hidden');
  } else if (statusGame === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
  }

  renderBoard();
  updateStatus();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  } else {
    return;
  }

  renderBoard();
  updateStatus();
});

renderBoard();
updateStatus();
