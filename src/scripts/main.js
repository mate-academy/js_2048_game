'use strict';

const Game = require('../modules/Game.class');

const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const startButton = document.getElementById('start-button');

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
});

window.addEventListener('keyup', handleKey);

function handleKey(action) {
  if (action.code === 'ArrowUp') {
    game.moveUp();
  }

  if (action.code === 'ArrowDown') {
    game.moveDown();
  }

  if (action.code === 'ArrowLeft') {
    game.moveLeft();
  }

  if (action.code === 'ArrowRight') {
    game.moveRight();
  }
}
