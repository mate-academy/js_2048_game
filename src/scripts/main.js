'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.getElementById('button_start');

startButton.onclick = () => game.start();

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.code === 'ArrowRight') {
    game.moveRight();
  }

  if (e.code === 'ArrowUp') {
    game.moveUp();
  }

  if (e.code === 'ArrowDown') {
    game.moveDown();
  }

  document.querySelector('.game-score').innerText = game.score;
});
