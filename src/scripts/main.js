'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.start');

button.addEventListener('click', () => {
  game.start();
});

document.addEventListener('keydown', (evt) => game.handleKeyDown(evt));
