'use strict';
// Uncomment the next lines to use your game instance in the browser

const Game = require('../modules/Game.class');

const game = new Game();

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();

    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();

    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
  }
});

// Write your code here
