'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const body = document.querySelector('body');
const button = document.querySelector('.button');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
  } else if (button.classList.contains('restart')) {
    game.restart();
  }
});

body.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  } else if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  }
});
