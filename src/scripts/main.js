'use strict';

// Uncomment the next lines to use your game instance in the browser
import { Game, lostMessage, winMessage } from '../modules/Game.class.js';

const game = new Game();
const button = document.querySelector('.start');

button.addEventListener('click', () => {
  if (button.textContent === 'Start') {
    game.start();

    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');

    if (!lostMessage.classList.contains('hidden')) {
      lostMessage.classList.add('hidden');
    }

    if (!winMessage.classList.contains('hidden')) {
      lostMessage.classList.add('hidden');
    }

    return;
  }

  if (button.textContent === 'Restart') {
    game.restart();

    if (!lostMessage.classList.contains('hidden')) {
      lostMessage.classList.add('hidden');
    }

    if (!winMessage.classList.contains('hidden')) {
      lostMessage.classList.add('hidden');
    }
  }
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();

      return;
    case 'ArrowUp':
      game.moveUp();

      return;
    case 'ArrowRight':
      game.moveRight();

      return;
    case 'ArrowDown':
      game.moveDown();
  }
});
