'use strict';
import '../styles/main.scss';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const mainButton = document.querySelector('.button');

mainButton.addEventListener('click', () => {
  if (mainButton.classList.contains('start')) {
    game.start();
  } else if (mainButton.classList.contains('restart')) {
    game.restart();
  }
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      game.getScore();
      break;
    case 'ArrowRight':
      game.moveRight();
      game.getScore();
      break;
    case 'ArrowUp':
      game.moveUp();
      game.getScore();
      break;
    case 'ArrowDown':
      game.moveDown();
      game.getScore();
      break;
  }
});
