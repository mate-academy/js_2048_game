'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (event.key === 'ArrowRight') {
    game.moveRight();
  } else if (event.key === 'ArrowUp') {
    game.moveUp();
  } else if (event.key === 'ArrowDown') {
    game.moveDown();
  } else if (event.key === 'r') {
    game.reset();
  }
});
