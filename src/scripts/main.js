'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

import Game from '../modules/Game.class';

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game(board);

  const startButton = document.querySelector('.start');

  startButton.addEventListener('click', () => {
    game.start();
  });
});
