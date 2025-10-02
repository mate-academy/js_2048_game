'use strict';

// const { jsx } = require('react/jsx-runtime');
// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const button = document.querySelector('.controls .button');

button.addEventListener('click', (e) => {
  if (button.classList.contains('start')) {
    game.start();
  } else if (button.classList.contains('restart')) {
    game.restart();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game.moveLeft(1);
  } else if (e.key === 'ArrowRight') {
    game.moveRight(1);
  } else if (e.key === 'ArrowUp') {
    game.moveUp(1);
  } else if (e.key === 'ArrowDown') {
    game.moveDown(1);
  }
});
