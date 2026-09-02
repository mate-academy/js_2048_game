'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

import Game from '../modules/Game.class';

const game = new Game();

const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
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
  }

  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (!moves[e.key]) {
    return;
  }

  e.preventDefault();
  moves[e.key]();
  updateUI();
});

function updateUI() {
  const state = game.getState();

  fieldRows.forEach((rowEl, i) => {
    const cells = rowEl.querySelectorAll('.field-cell');

    cells.forEach((cell, j) => {
      const value = state[i][j];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
    });
  });

  scoreEl.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}
