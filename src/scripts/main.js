'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const buttonStart = document.querySelector('.button.start');

buttonStart.addEventListener('click', () => {
  if (buttonStart.classList.contains('start')) {
    game.start();

    buttonStart.textContent = 'Restart';
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
  } else {
    game.restart();
  }
});
