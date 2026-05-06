'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

document.addEventListener('keydown', (e) => {
  if (Gamepad.status !== 'palying') {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp('up');
      break;
    case 'ArrowDown':
      game.moveDown('down');
      break;
    case 'ArrowLeft':
      game.moveLeft('left');
      break;
    case 'ArrowRight':
      game.moveRight('right');
      break;
  }
  game.renderBoard();
});
