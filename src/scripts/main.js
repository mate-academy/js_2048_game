'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const button = document.querySelector('.button');

if (button) {
  button.addEventListener('click', () => {
    if (button.classList.contains('start')) {
      game.start();
    } else if (button.classList.contains('restart')) {
      game.restart();
    }
  });
}

// в дужках повинно бути 'event'     |  тут але виводило помилку в npm run lint
document.addEventListener('keydown', () => {
  if (event.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (event.key === 'ArrowRight') {
    game.moveRight();
  } else if (event.key === 'ArrowUp') {
    game.moveUp();
  } else if (event.key === 'ArrowDown') {
    game.moveDown();
  }
});
