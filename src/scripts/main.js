'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

import Game from '../modules/Game.class.js';

const game = new Game();
const startButton = document.querySelector('.button.start');
const gameScore = document.querySelector('.game-score');
const fieldCells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

let previousState = game.getState();

function updateUI() {
  const newState = game.getState();

  newState.forEach((row, y) => {
    row.forEach((value, x) => {
      const cell = fieldCells[y * 4 + x];
      const prevValue = previousState[y][x];

      cell.textContent = value || '';
      cell.className = `field-cell${value ? ` field-cell--${value}` : ''}`;

      if (value !== prevValue) {
        cell.classList.add('appear');

        setTimeout(() => {
          cell.classList.remove('appear');
        }, 150);
      }
    });
  });

  previousState = newState.map((row) => [...row]);

  gameScore.textContent = game.getScore();
  messageStart.classList.toggle('hidden', game.getStatus() !== 'idle');
  messageWin.classList.toggle('hidden', game.getStatus() !== 'win');
  messageLose.classList.toggle('hidden', game.getStatus() !== 'lose');
  startButton.textContent = game.getStatus() === 'idle' ? 'Start' : 'Restart';
  startButton.className = `button ${game.getStatus() === 'idle' ? 'start' : 'restart'}`;
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  updateUI();
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
  updateUI();
});

updateUI();
