'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const startBtn = document.querySelector('.start');

startBtn.addEventListener('click', () => game.start());

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }
});
