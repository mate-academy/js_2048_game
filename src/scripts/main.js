'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const arr = [[0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]];
const game = new Game(arr);

// Write your code here

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  if (button.textContent !== 'Restart') {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerHTML = 'Restart';
  };

  if (button.textContent === 'Restart') {
    game.restart();
  }
});

document.addEventListener('keydown', () => {
  const key = event.key;

  if (button.textContent === 'Restart') {
    if (key === 'ArrowUp') {
      game.moveUp();
    }

    if (key === 'ArrowDown') {
      game.moveDown();
    }

    if (key === 'ArrowRight') {
      game.moveRight();
    }

    if (key === 'ArrowLeft') {
      game.moveLeft();
    }
  }
});
