'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const btnStart = document.querySelector('.start');

btnStart.addEventListener('click', () => {
  game.start();
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  switch (e.code) {
    case 'ArrowLeft': // Left arrow
      game.moveLeft();
      break;
    case 'ArrowUp': // Up arrow
      game.moveUp();
      break;
    case 'ArrowRight': // Right arrow
      game.moveRight();
      break;
    case 'ArrowDown': // Down arrow
      game.moveDown();
      break;
    default:
      break;
  }
});
