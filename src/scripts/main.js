'use strict';

import Game from '../modules/Game.class.js';
const game = new Game();

const startBtn = document.querySelector('.start');
const restartBtn = document.querySelector('.message-lose');

startBtn.addEventListener('click', () => {
  game.start();
  game.render();
  game.updateScore();
});

restartBtn.addEventListener('click', () => {
  game.restart();
  game.render();
  game.updateScore();
});

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') {
    game.moveLeft();
    game.render();
    game.updateScore();
    game.checklose();
    game.checkWin();
  }

  if (event.key === 'ArrowRight') {
    game.moveRight();
    game.render();
    game.updateScore();
    game.checklose();
    game.checkWin();
  }

  if (event.key === 'ArrowUp') {
    game.moveUp();
    game.render();
    game.updateScore();
    game.checklose();
    game.checkWin();
  }

  if (event.key === 'ArrowDown') {
    game.moveDown();
    game.render();
    game.updateScore();
    game.checklose();
    game.checkWin();
  }
});
