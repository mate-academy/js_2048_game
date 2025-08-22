'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const cells = document.querySelectorAll('.field-cell');

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }
  updateUI();
});

// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      game.moveLeft();
      updateUI();
      break;
    case 'ArrowRight':
      event.preventDefault();
      game.moveRight();
      updateUI();
      break;
    case 'ArrowUp':
      event.preventDefault();
      game.moveUp();
      updateUI();
      break;
    case 'ArrowDown':
      event.preventDefault();
      game.moveDown();
      updateUI();
      break;
  }
});

function updateUI() {
  const board = game.getState();
  const score = game.getScore();

  gameScore.textContent = score;

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  });

  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  if (status === 'win') {
    messageWin.classList.remove('hidden');
  } else if (status === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

// Write your code here
