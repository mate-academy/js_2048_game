'use strict';

// const Game = require('../modules/Game.class');
// const game = new Game();

import Game from '../modules/Game.class.js';

const game = new Game();
const button = document.querySelector('.button');
const cells = Array.from(document.querySelectorAll('.field-cell'));
const scoreLabel = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function boardView() {
  const state = game.getState();
  let cellIndex = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = cells[cellIndex];
      const value = state[i][j];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
      }
      cellIndex++;
    }
  }

  scoreLabel.textContent = game.getScore();
}

function statusView() {
  const gameStatus = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'start') {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    messageStart.classList.remove('hidden');
  } else if (gameStatus === 'playing') {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }
}

button.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'start') {
    game.start();
  } else {
    game.restart();
  }

  boardView();
  statusView();
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  let moved = false;

  if (e.key === 'ArrowLeft') {
    moved = game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    moved = game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    moved = game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    moved = game.moveDown();
  }

  if (moved) {
    game.checkWinOrLose();
    boardView();
    statusView();
  }
});
