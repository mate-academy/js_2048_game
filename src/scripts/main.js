'use strict';
/* global game */
// Uncomment the next lines to use your game instance in the browser

const Game = require('../modules/Game.class');

const startButton = document.querySelector('.start');
const message = document.querySelector('.message-start');

document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
  game.render();
});

startButton.addEventListener('click', () => {
  if (startButton.textContent === 'Start') {
    message.className = 'hidden';
    window.game = new Game();
    game.start();
    game.render();
    startButton.textContent = 'Restart';
    startButton.classList = 'button restart';
  } else if (startButton.textContent === 'Restart') {
    window.game = new Game();
    game.restart();
    game.render();
    startButton.textContent = 'Start';
    startButton.className = 'button start';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    game.render();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
    game.render();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
    game.render();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
    game.render();
  }
});
