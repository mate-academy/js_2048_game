'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.querySelector('.button').addEventListener('click', () => {
  const button = document.querySelector('.button');

  if (button.textContent === 'Start') {
    game.start();
  } else {
    game.restart();
  }
});

const keyMap = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

document.addEventListener('keydown', (e) => {
  if (keyMap[e.key]) {
    e.preventDefault();
    keyMap[e.key]();
  }
});
