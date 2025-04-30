'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  if (!game.hasStarted) {
    game.start();
  } else {
    game.restart();
  }
});
