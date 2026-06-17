'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const scoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');
const button = document.querySelector('.button');

function render() {
  const state = game.getState();
  const score = game.getScore();
  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = score;

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  switch (status) {
    case 'idle':
      startMessage.classList.remove('hidden');
      break;
    case 'win':
      winMessage.classList.remove('hidden');
      break;
    case 'lose':
      loseMessage.classList.remove('hidden');
      break;
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();
    game.start();
  }

  render();
});

// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (event.key) {
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

  render();
});

render();
