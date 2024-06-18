'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startBtn = document.querySelector('.start');
const restartBtn = document.querySelector('.restart');
const arrowsToggle = (event) => {
  if (event.key === 'ArrowUp') {
    game.moveUp();
  } else if (event.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (event.key === 'ArrowRight') {
    game.moveRight();
  } else if (event.key === 'ArrowDown') {
    game.moveDown();
  }
};;

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

  document.removeEventListener('keydown', arrowsToggle);
});
