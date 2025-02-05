'use strict';

import Game from '../modules/Game.class';

// Uncomment the next lines to use your game instance in the browser
document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.button.start');
  const game = new Game();

  startButton.addEventListener('click', () => {
    if (startButton.classList.contains('start')) {
      game.start();
      startButton.textContent = 'Restart';
      startButton.classList.remove('start');
      startButton.classList.add('restart');
    } else {
      game.restart();
      startButton.textContent = 'Start';
      startButton.classList.remove('restart');
      startButton.classList.add('start');
    }
  });

  // eslint-disable-next-line no-shadow
  document.addEventListener('keydown', (event) => {
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
});

// Write your code here
