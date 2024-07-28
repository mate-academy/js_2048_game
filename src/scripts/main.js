'use strict';

// Uncomment the next lines to use your game instance in the browser

const Game = require('../modules/Game.class');
const game = new Game([
  [2, 2, 2, 2],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 2, 0],
]);

game.CELL_SIZE = 75;
game.CELL_GAP = 10;
game.start();

function setupInput() {
  document.addEventListener('keydown', handleInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case 'ArrowLeft':
      await game.moveLeft();
      break;
    case 'ArrowRight':
      await game.moveRight();
      break;
    case 'ArrowUp':
      await game.moveUp();
      break;
    case 'ArrowDown':
      await game.moveDown();
      break;
    default:
      setupInput();

      return;
  }

  setupInput();
  game.newTile();
}

setupInput();
