'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  game.start();
  startButton.textContent = 'Restart';
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'idle') {
    e.preventDefault();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }
});
