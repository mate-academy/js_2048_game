'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const button = document.querySelector('.button.start');

button.addEventListener('click', (e) => {
  if (button.classList.contains('start')) {
    game.start();

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'restart';
  } else if (button.classList.contains('restart')) {
    game.restart();

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'start';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && game.getStatus() === 'playing') {
    game.moveUp();
    game.checkWin();
    game.checkLose();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' && game.getStatus() === 'playing') {
    game.moveDown();
    game.checkWin();
    game.checkLose();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && game.getStatus() === 'playing') {
    game.moveLeft();
    game.checkWin();
    game.checkLose();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' && game.getStatus() === 'playing') {
    game.moveRight();
    game.checkWin();
    game.checkLose();
  }
});
