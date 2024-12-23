'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

document.addEventListener('keydown', (e) => {
  // // eslint-disable-next-line no-console
  // console.log(e.key);

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
