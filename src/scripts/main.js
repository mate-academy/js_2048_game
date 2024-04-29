'use strict';

const ArrowUp = 'ArrowUp';
const ArrowRight = 'ArrowRight';
const ArrowDown = 'ArrowDown';
const ArrowLeft = 'ArrowLeft';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case ArrowUp:
      game.moveUp();
      break;
    case ArrowRight:
      game.moveRight();
      break;
    case ArrowDown:
      game.moveDown();
      break;
    case ArrowLeft:
      game.moveLeft();
      break;
    default:
      break;
  }
});
