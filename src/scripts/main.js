'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const startBtn = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState();

  state.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = game.getScore();
}

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

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  } else {
    game.restart();
    startBtn.textContent = 'Start';
    startBtn.classList.remove('restart');
    startBtn.classList.add('start');
  }

  renderBoard();
  updateMessages();
});

function updateMessages() {
  const statusOfGame = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (statusOfGame === 'win') {
    messageWin.classList.remove('hidden');
  } else if (statusOfGame === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (statusOfGame === 'idle') {
    messageStart.classList.remove('hidden');
  }
}
