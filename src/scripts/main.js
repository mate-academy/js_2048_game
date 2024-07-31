'use strict';

// Uncomment the next lines to use your game instance in the browser

const Game = require('../modules/Game.class');

const initialState = [
  [2, 2, 2, 2],
  [0, 16, 0, 0],
  [0, 0, 32, 0],
  [0, 0, 0, 64],
];

const game2048 = new Game(initialState);

game2048.start();

const handleKeyDown = function handleInput(e) {
  switch (e.key) {
    case 'ArrowLeft':
      game2048.moveLeft();
      break;
    case 'ArrowRight':
      game2048.moveRight();
      break;
    case 'ArrowUp':
      game2048.moveUp();
      break;
    case 'ArrowDown':
      game2048.moveDown();
      break;
    default:
  }
};

document.addEventListener('keydown', handleKeyDown);
