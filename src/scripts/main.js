'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
  } else if (startButton.classList.contains('restart')) {
    game.restart();
  }
});

document.addEventListener('keyup', (e) => {
  if (game.getStatus() === 'lose') {
      game.loseMessage();
      return;
  }

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
      default:
          return;
  }

  game.updateBoard();

  if (game.getStatus() === 'win') {
      game.winMessage();
  }
});

