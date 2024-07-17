'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const start = document.querySelector('.start');

start.addEventListener('click', () => {
  game.start();
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowRight': game.moveRight(); break;
    case 'ArrowLeft': game.moveLeft(); break;
    case 'ArrowDown': game.moveDown(); break;
    case 'ArrowUp': game.moveUp(); break;
  }
});

// Write your code here
