'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button.start');
const restartButton = document.querySelector('.button.restart');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');

startButton.addEventListener('click', () => {
  game.start();

  startButton.classList.add('hidden');
  restartButton.classList.remove('hidden');
  startMessage.classList.add('hidden');
});

const dialog = document.getElementById('confirm-restart');

document.addEventListener('keydown', (e) => {
  if (dialog.open || !game.started) {
    e.preventDefault();
    e.stopPropagation();

    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }
});

document.addEventListener('keydown', (e) => {
  if (dialog.open || !game.started) {
    e.preventDefault();
    e.stopPropagation();

    return;
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }
});

document.addEventListener('keydown', (e) => {
  if (dialog.open || !game.started) {
    e.preventDefault();
    e.stopPropagation();

    return;
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }
});

document.addEventListener('keydown', (e) => {
  if (dialog.open || !game.started) {
    e.preventDefault();
    e.stopPropagation();

    return;
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }
});

restartButton.addEventListener('click', () => {
  game.restart();

  restartButton.classList.add('hidden');
  startButton.classList.remove('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.remove('hidden');
});
