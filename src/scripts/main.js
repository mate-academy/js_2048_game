'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

game.button.addEventListener('click', () => {
  if (game.button.classList.contains('start')) {
    game.start();
  } else {
    game.restart();
  }
});

document.addEventListener('keydown', () => {
  if (game.status !== 'playing') {
    return;
  }

  switch (event.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }
});
