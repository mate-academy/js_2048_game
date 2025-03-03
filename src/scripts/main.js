'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const game = new Game();

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
}

function handleInput(e) {
  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      game.isEmpty();

      game.statusCheck();
      setupInputOnce();
      break;

    case 'ArrowDown':
      game.moveDown();
      game.isEmpty();

      game.statusCheck();
      setupInputOnce();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      game.isEmpty();

      game.statusCheck();
      setupInputOnce();
      break;

    case 'ArrowRight':
      game.moveRight();
      game.isEmpty();

      game.statusCheck();
      setupInputOnce();
      break;

    default:
      setupInputOnce();
  }
}

game.buttonStart.addEventListener('click', (e) => {
  if (game.buttonStart.textContent === 'Start') {
    game.buttonStart.textContent = 'Restart';
    game.buttonStart.classList.toggle('start');
    game.buttonStart.classList.toggle('restart');
    game.initialState = 'playing';
    game.start();
    setupInputOnce();
  } else if (game.buttonStart.textContent === 'Restart') {
    game.restart();
    setupInputOnce();
  }
});
