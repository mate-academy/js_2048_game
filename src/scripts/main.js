'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
import Game from '../modules/Game.class';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const startButton = document.querySelector('.start');

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

// Write your code here
function updateField() {
  const state = game.getState();

  for (let i = 0; i < cells.length; i++) {
    const row = Math.floor(i / 4);
    const column = i % 4;
    const value = state[row][column];

    cells[i].textContent = value === 0 ? '' : value;
  }
}

function updateScore() {
  score.textContent = game.getScore();
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  updateField();
  updateScore();

  startButton.textContent = 'Restart';
  startButton.classList.add('restart');
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
});

document.addEventListener('keydown', (keyboardEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let hasChanged = false;

  switch (keyboardEvent.key) {
    case 'ArrowLeft':
      hasChanged = game.moveLeft();
      break;

    case 'ArrowRight':
      hasChanged = game.moveRight();
      break;

    case 'ArrowUp':
      hasChanged = game.moveUp();
      break;

    case 'ArrowDown':
      hasChanged = game.moveDown();
      break;

    default:
      return;
  }

  if (hasChanged && game.getStatus() === 'playing') {
    game.addRandomTile();
  }

  updateField();
  updateScore();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
});
