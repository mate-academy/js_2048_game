'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// start / restart
const startButton = document.querySelector('button.start');
let switcher = 0;

startButton.addEventListener('click', (ev) => {
  switcher++;

  if (switcher % 2 === 1) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    game.start();
  } else {
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
    game.restart();
  }
});
