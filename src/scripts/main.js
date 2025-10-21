'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
import Game from '../modules/Game.class';

const game = new Game();

// Write your code here

// DOM elements
const startButton = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState().flat();

  cells.forEach((cell, i) => {
    const value = state[i];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  const statusGame = game.getStatus();

  if (statusGame === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (statusGame === 'win') {
    messageWin.classList.remove('hidden');
  } else if (statusGame === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

// button Start/Restart
startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();
  }
  renderBoard();
});

// keyboard

document.addEventListener('keydown', (ev) => {
  switch (ev.key) {
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
});

renderBoard();
