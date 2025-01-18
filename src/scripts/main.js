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
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  if (startButton.textContent === 'Start') {
    message.className = 'hidden';
    window.game = new Game();
    game.start();
    game.render();
    startButton.textContent = 'Restart';
    startButton.classList = 'button restart';
  } else if (startButton.textContent === 'Restart') {
    window.game = new Game();
    console.log('bla bla bla');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    game.restart();
    game.render();
    startButton.textContent = 'Start';
    startButton.className = 'button start';
  }
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }
  game.render();
});
