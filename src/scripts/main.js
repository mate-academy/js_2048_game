'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const cells = document.querySelectorAll('.field-cell');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function updateUI() {
  const state = game.getState().flat();
  const gameStatus = game.getStatus();

  cells.forEach((cell, i) => {
    const newValue = state[i];
    const oldValue = cell.textContent ? parseInt(cell.textContent) : 0;

    cell.className = 'field-cell';
    cell.textContent = newValue || '';

    if (newValue) {
      cell.classList.add(`field-cell--${newValue}`);

      if (oldValue === 0) {
        cell.classList.add('field-cell--new');
      }

      if (oldValue !== 0 && oldValue !== newValue) {
        cell.classList.add('field-cell--merged');
      }
    }
  });

  scoreElement.textContent = game.getScore();

  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

  if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
  }

  if (gameStatus !== 'idle') {
    msgStart.classList.add('hidden');
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  }
}

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  updateUI();
});

document.addEventListener('keydown', (keyboardEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (keyboardEvent.key) {
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

  updateUI();
});
