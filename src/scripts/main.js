'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.button.start');
const scoreEl = document.querySelector('.game-score');
const fieldCells = document.querySelectorAll('.field-cell');

const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

startButton.addEventListener('click', () => {
  game.restart();
  updateUI();
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const key = event.key;

  if (key === 'ArrowLeft') {
    game.moveLeft();
  } else if (key === 'ArrowRight') {
    game.moveRight();
  } else if (key === 'ArrowUp') {
    game.moveUp();
  } else if (key === 'ArrowDown') {
    game.moveDown();
  }

  updateUI();

  const Gamestatus = game.getStatus();

  if (Gamestatus === 'win') {
    msgWin.classList.remove('hidden');
  } else if (Gamestatus === 'lose') {
    msgLose.classList.remove('hidden');
  }
});

function updateUI() {
  const board = game.getState();

  scoreEl.textContent = game.getScore();

  fieldCells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });
}
