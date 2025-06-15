'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

window.addEventListener('keydown', (e) => {
  if (game.gameStatus === 'playing') {
    switch (e.key) {
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      default:
    }
  }
});

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  button.classList.toggle('start');
  button.classList.toggle('restart');

  if (button.innerText === 'Start') {
    button.innerText = 'Reset';
    game.start();
  } else {
    button.innerText = 'Start';
    game.reset();
  }
});
