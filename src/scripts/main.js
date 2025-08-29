'use strict';
/* eslint no-console: ["error", { allow: ["warn", "log"] }] */

const Game = require('../modules/Game.class');
const game = new Game();
const startButton = document.querySelector('.start');

startButton.addEventListener('click', (e) => {
  if (startButton.classList.contains('start')) {
    game.start();
  }

  if (startButton.classList.contains('restart')) {
    game.restart();
  }

  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
});

document.addEventListener('keydown', (e) => {
  const currentStatus = game.getStatus();

  if (currentStatus !== 'playing') {
    return;
  }

  switch (e.key) {
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
  game.updateMessage();
});
