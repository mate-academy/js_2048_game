'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const controls = document.querySelector('.controls');
const startButton = controls.querySelector('button');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
  } else {
    game.restart();
  }

  startButton.classList.add('restart');
  startButton.classList.remove('start');
  startButton.textContent = 'Restart';

  game.updateMessage();
});

document.addEventListener('keydown', (e) => {
  game.getStatus();

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;

    case 'ArrowRight':
      moved = game.moveRight();
      break;

    case 'ArrowUp':
      moved = game.moveUp();
      break;

    case 'ArrowDown':
      moved = game.moveDown();
      break;
  }

  if (moved) {
    game.makeRandomCell();
    game.renderCells();
    game.updateMessage();
  }
});
