'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const initialState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const startButton = document.querySelector('.button-start');
const pageRows = [...document.querySelectorAll('.field-row')];

const game = new Game(initialState, pageRows);

startButton.addEventListener('click', () => {
  game.start();
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }
});

// const gameField = document.querySelector('game-field');
