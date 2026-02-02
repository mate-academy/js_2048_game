'use strict';

const Game = require('../src/modules/Game.class');
const game = new Game();

document.addEventListener('keydown', (e) => game.handleKeyPress(e));

document.querySelector('.start').addEventListener('click', () => {
  if (game.getStatus() === 'idle' || game.getStatus() === 'lose') {
    game.start();
  } else {
    game.restart();
  }
  game.render();
});

game.render();
