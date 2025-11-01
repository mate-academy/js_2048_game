'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const button = document.getElementsByClassName('button')[0];

button.addEventListener('click', () => {
  if (game.status === 'idle') {
    game.start();
  } else if (['playing', 'win', 'lose'].includes(game.status)) {
    game.restart();
  }
});
