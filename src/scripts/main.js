'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
// import { Game } from '../modules/Game.class';

const game = new Game();

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
}

function handleInput(e) {
  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      game.randomChip();
      game.isEmpty();

      if (game.initialState === 'lose') {
        game.getStatus();
        break;
      } else {
        setupInputOnce();
        break;
      }

    case 'ArrowDown':
      game.moveDown();
      game.randomChip();
      game.isEmpty();

      if (game.initialState === 'lose') {
        game.getStatus();
        break;
      } else {
        setupInputOnce();
        break;
      }

    case 'ArrowLeft':
      game.moveLeft();
      game.randomChip();
      game.isEmpty();

      if (game.initialState === 'lose') {
        game.getStatus();
        break;
      } else {
        setupInputOnce();
        break;
      }

    case 'ArrowRight':
      game.moveRight();
      game.randomChip();
      game.isEmpty();

      if (game.initialState === 'lose') {
        game.getStatus();
        break;
      } else {
        setupInputOnce();
        break;
      }

    default:
      setupInputOnce();
  }
}

game.buttonStart.onclick = () => {
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
};
