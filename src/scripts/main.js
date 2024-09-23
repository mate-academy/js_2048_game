'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const body = document.querySelector('body');
const button = document.querySelector('.button');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
  } else if (button.classList.contains('restart')) {
    game.restart();
  }
});

body.addEventListener('keydown', (e) => {
  game.getState();

  const copyOfState = JSON.stringify(game.initialState);

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
  }

  game.getState();

  const actualState = JSON.stringify(game.initialState);

  if (copyOfState !== actualState) {
    game.addTiles(1);
  }
  game.getScore();
});
