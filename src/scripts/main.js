'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');

function renderBoard() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.className = 'field-cell';

    if (value > 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });

  scoreEl.textContent = game.getScore();
}

function updateMessages() {
  const gameStatus = game.getStatus();

  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }

  renderBoard();
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
