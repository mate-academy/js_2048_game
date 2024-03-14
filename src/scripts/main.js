/* eslint-disable */
'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const startButton = document.getElementById('start-button');
startButton.addEventListener('click', () => game.start());

window.addEventListener('keyup', handleKey);

function handleKey(event) {
  if (event.code === 'ArrowUp') {
    game.moveUp();
  }
  if (event.code === 'ArrowDown') {
    game.moveDown();
  }
  if (event.code === 'ArrowLeft') {
    game.moveLeft();
  }
  if (event.code === 'ArrowRight') {
    game.moveRight();
  }
}
