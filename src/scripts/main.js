'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const startButton = document.querySelector('.button-start');
const restartButton = document.querySelector('.button-restart');
const initialRows = [...document.querySelectorAll('.field-row')];

const game = new Game([...initialRows]);

startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  restartButton.style.display = 'block';
  game.start();
});

restartButton.addEventListener('click', () => {
  game.restart();
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
