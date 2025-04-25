'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const gameField = document.querySelector('tbody');
const button = document.querySelector('.button');

document.addEventListener('keydown', clickHandler);
button.addEventListener('click', startHandler);

function startHandler() {
  if (button.classList.contains('restart')) {
    game.restart();
    game.updateView(gameField);
  } else {
    game.start();
    game.updateView(gameField);
  }
}

function clickHandler() {
  switch (event.key) {
    case 'ArrowUp':
      game.moveUp();
      game.updateView(gameField);
      break;
    case 'ArrowDown':
      game.moveDown();
      game.updateView(gameField);
      break;
    case 'ArrowLeft':
      game.moveLeft();
      game.updateView(gameField);
      break;
    case 'ArrowRight':
      game.moveRight();
      game.updateView(gameField);
      break;
  }
}

const game = new Game();

// Write your code here
