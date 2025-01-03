'use strict';

// Uncomment the next lines to use your game instance in the browser

import Game from '../modules/Game.class';

const game = new Game();
const gameScore = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');

button.addEventListener('click', () => {
  button.classList.toggle('restart');
  messageStart.classList.toggle('hidden');

  if (document.querySelector('.restart')) {
    document.querySelector('.restart').textContent = 'Restart';
    game.start();
  }
  button.classList.toggle('start');

  if (document.querySelector('.start')) {
    document.querySelector('.start').textContent = 'Start';
    game.restart();
    gameScore.textContent = game.getScore();
  }
  game.getState();
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
  gameScore.textContent = game.getScore();
  game.getState();
  game.getStatus();
});
