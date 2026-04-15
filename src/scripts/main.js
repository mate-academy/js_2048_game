'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

// DOM references
const scoreEl = document.querySelector('.game-score');
const button = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const r = Math.floor(index / 4);
    const c = index % 4;
    const val = state[r][c];

    // Remove previous value class
    cell.className = 'field-cell';

    if (val !== 0) {
      cell.textContent = val;
      cell.classList.add(`field-cell--${val}`);
    } else {
      cell.textContent = '';
    }
  });

  scoreEl.textContent = game.getScore();
}

function renderMessages() {
  const gameStatus = game.getStatus();

  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else {
    game.restart();
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  }

  renderBoard();
  renderMessages();
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
  renderMessages();
});
