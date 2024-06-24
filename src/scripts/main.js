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
  if (event.key === 'ArrowUp') {
    game.moveUp();
    score.textContent = game.score;
  } else if (event.key === 'ArrowLeft') {
    game.moveLeft();
    score.textContent = game.score;
  } else if (event.key === 'ArrowRight') {
    game.moveRight();
    score.textContent = game.score;
  } else if (event.key === 'ArrowDown') {
    game.moveDown();
    score.textContent = game.score;
  }
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
