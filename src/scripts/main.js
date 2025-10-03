'use strict';

// const { jsx } = require('react/jsx-runtime');
// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const button = document.querySelector('.controls .button');

button.addEventListener('click', (e) => {
  if (button.classList.contains('start')) {
    game.start();
  } else if (button.classList.contains('restart')) {
    game.restart();
  }
});

document.addEventListener('keydown', (e) => {
  if (/Arrow/.test(e.key) && game.getStatus() === 'idle') {
    game.start();

    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft(1);
      break;

    case 'ArrowRight':
      game.moveRight(1);
      break;

    case 'ArrowUp':
      game.moveUp(1);
      break;

    case 'ArrowDown':
      game.moveDown(1);
      break;
  }
});
