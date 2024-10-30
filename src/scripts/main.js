'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('keydown', (e) => {
  // Renamed 'event' to 'e'
  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  // Update UI based on the game state
  updateUI();
});

function updateUI() {
  // Render the game board and score on the UI
}
