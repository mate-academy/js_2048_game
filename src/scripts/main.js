'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.getElementById('start');

startButton.addEventListener('click', () => {
  game.start();
});
SetupInputOnce();

function SetupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
};

function handleInput(events) {
  switch (events.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      SetupInputOnce();

      return;
  }

  SetupInputOnce();
}

const restart = document.getElementById('restart');

restart.addEventListener('click', () => {
  game.restart();
  game.spw();
});
