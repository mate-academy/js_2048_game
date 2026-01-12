'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const button = document.querySelector('.button');

button.addEventListener('click', (ev) => {
  game.start(button);
});

document.addEventListener('keydown', (evnt) => {
  if (evnt.key === 'ArrowDown') {
    game.moveDown();
  }

  if (evnt.key === 'ArrowUp') {
    game.moveUp();
  }

  if (evnt.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (evnt.key === 'ArrowRight') {
    game.moveRight();
  }
});

// Write your code here
