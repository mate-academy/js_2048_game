'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const controlButton = document.querySelector('.button');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function renderGame() {
  const state = game.getState();
  const gameStatus = game.getStatus();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const value = state[row][column];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

controlButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    controlButton.textContent = 'Restart';
    controlButton.classList.remove('start');
    controlButton.classList.add('restart');
  } else {
    game.restart();
    game.start();
  }

  renderGame();
});

document.addEventListener('keydown', (e) => {
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

  renderGame();
});

renderGame();
