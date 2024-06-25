'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startBtn = document.querySelector('.start');
const restartBtn = document.querySelector('.restart');

const score = document.querySelector('.game-score');

// eslint-disable-next-line no-shadow
const arrowsToggle = (event) => {
  switch (event.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      return;
  }

  score.textContent = game.score;
};

startBtn.addEventListener('click', () => {
  startBtn.classList.add('hidden');
  restartBtn.classList.remove('hidden');

  game.start();

  document.addEventListener('keydown', arrowsToggle);
});

restartBtn.addEventListener('click', () => {
  restartBtn.classList.add('hidden');
  startBtn.classList.remove('hidden');

  game.restart();

  game.score = 0;
  score.textContent = game.score;

  document.removeEventListener('keydown', arrowsToggle);
});
