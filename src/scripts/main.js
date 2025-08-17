'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button.start');

let controlsAttached = false;

function onKeyDown(e) {
  const { key } = e;

  // не даємо сторінці скролитись стрілками
  e.preventDefault();

  // рухи доступні лише під час гри
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (key) {
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
}

function attachControlsOnce() {
  if (controlsAttached) {
    return;
  }
  window.addEventListener('keydown', onKeyDown);
  controlsAttached = true;
}

startButton.addEventListener('click', () => {
  game.start();
  attachControlsOnce();
  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
});
