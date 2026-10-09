'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

document.querySelector('.button').addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    return;
  }

  if (
    game.getStatus() === 'playing' ||
    game.getStatus() === 'lose' ||
    game.getStatus() === 'win'
  ) {
    game.restart();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }
});
