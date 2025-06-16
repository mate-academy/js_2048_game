'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startRestartButton = document.querySelector('button');

const scoreTile = document.querySelector('.game-score');

startRestartButton.addEventListener('click', (e) => {
  if (game.getStatus() === 'idle') {
    startRestartButton.classList.remove('start');
    startRestartButton.classList.add('restart');

    startRestartButton.textContent = 'Restart';
    document.querySelector('.message-start').classList.add('hidden');
    game.start();
  } else {
    startRestartButton.classList.remove('restart');
    startRestartButton.classList.add('start');

    startRestartButton.textContent = 'Start';
    scoreTile.textContent = '0';
    document.querySelector('.message-start').classList.remove('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
    document.querySelector('.message-win').classList.add('hidden');
    game.restart();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
    let moved = false;

    switch (e.key) {
      case 'ArrowUp':
        moved = game.moveUp();
        break;
      case 'ArrowDown':
        moved = game.moveDown();
        break;
      case 'ArrowLeft':
        moved = game.moveLeft();
        break;
      case 'ArrowRight':
        moved = game.moveRight();
        break;
      default:
        break;
    }

    if (moved) {
      game.addNewTile();
      game.updateUI();
      game.checkGameOver();
      scoreTile.textContent = game.getScore();

      if (game.getStatus() === 'lose') {
        document.querySelector('.message-lose').classList.remove('hidden');
      } else {
        document.querySelector('.message-lose').classList.add('hidden');
      }

      if (game.getStatus() === 'win') {
        document.querySelector('.message-win').classList.remove('hidden');
      } else {
        document.querySelector('.message-win').classList.add('hidden');
      }
    }
  }
});
