'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');

document.addEventListener('DOMContentLoaded', () => {
  startButton.addEventListener('click', function startGameHandler() {
    game.start();
    game.updateMessage();

    startButton.innerText = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');

    startButton.removeEventListener('click', startGameHandler);

    startButton.addEventListener('click', () => {
      game.restart();
    });
  });
});

document.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;

    case 'ArrowRight':
      moved = game.moveRight();
      break;

    case 'ArrowUp':
      moved = game.moveUp();
      break;

    case 'ArrowDown':
      moved = game.moveDown();
      break;
  }

  if (moved) {
    game.createRandomTile();
    game.checkStatus();
    game.updateMessage();

    document.querySelector('.game-score').textContent = game.score;
  }
});
