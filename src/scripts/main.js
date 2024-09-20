'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.button.start');
const start = document.querySelector('.message.message-start');
const win = document.querySelector('.message.message-win');
const lose = document.querySelector('.message.message-lose');

startButton.addEventListener('click', () => {
  if (
    game.getStatus() === Game.gameStatus.idle ||
    game.getStatus() === Game.gameStatus.lose
  ) {
    game.start();
    start.classList.add('hidden');

    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();
    start.classList.remove('hidden');
    win.classList.add('hidden');
    lose.classList.add('hidden');
    game.score = 0;
    game.updateScore();
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  }
});

document.addEventListener('keyup', (e) => {
  if (game.getStatus() === Game.gameStatus.playing) {
    if (e.code === 'ArrowLeft') {
      game.moveLeft();
    }

    if (e.code === 'ArrowRight') {
      game.moveRight();
    }

    if (e.code === 'ArrowUp') {
      game.moveUp();
    }

    if (e.code === 'ArrowDown') {
      game.moveDown();
    }
  }
});
