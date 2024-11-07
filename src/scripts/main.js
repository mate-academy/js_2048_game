'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const cells = document.querySelectorAll('.field-cell');

startButton.addEventListener('click', (e) => {
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');

  cells.forEach((cell) => {
    cell.classList.remove('hidden');
  });

  game.start();
});
