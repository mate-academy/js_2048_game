'use strict';
import Game from '../modules/Game.class.js';

const game = new Game();
const startButton = document.querySelector('.start');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function updateUI() {
  const state = game.getState();

  scoreElement.textContent = game.getScore();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell field-cell--${value}`;
  });

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  } else {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const keyActions = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (keyActions[e.key]) {
    keyActions[e.key]();
    updateUI();
  }
});

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startButton.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  updateUI();
});
