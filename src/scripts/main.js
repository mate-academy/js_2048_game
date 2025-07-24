'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

import { Game } from '../modules/Game.class.js';

const myGame = new Game(); // ← create an instance

document.querySelector('.button').addEventListener('click', (e) => {
  const button = e.currentTarget;

  if (button.classList.contains('start')) {
    // It has both .button and .start
    myGame.start();
  }

  if (button.classList.contains('restart')) {
    // It has both .button and .start
    myGame.restart();
  }
});

document.addEventListener('keydown', (e) => {
  const button = document.querySelector('.button');

  if (!button.classList.contains('start')) {
    button.classList.add('restart');
    button.classList.remove('hidden');
  }

  if (e.key === 'ArrowLeft') {
    myGame.moveLeft();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    myGame.moveRight();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    myGame.moveUp();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    myGame.moveDown();
  }
});
