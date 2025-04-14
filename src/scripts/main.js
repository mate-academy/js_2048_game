'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const btnStart = document.querySelector('.start');

btnStart.addEventListener('click', () => {
  game.start();
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  switch (e.code) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      break;
  }
});
