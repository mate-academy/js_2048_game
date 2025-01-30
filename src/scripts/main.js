'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const startButton = document.querySelector('.button-start');
const restartButton = document.querySelector('.button-restart');
const initialRows = [...document.querySelectorAll('.field-row')];
const score = document.querySelector('.game-score');
const game = new Game([...initialRows]);

startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  restartButton.style.display = 'block';
  document.querySelector('.message-start').remove();

  game.start();
});

restartButton.addEventListener('click', () => {
  game.restart();
  score.textContent = 0;
});

document.addEventListener('keydown', (e) => {
  if (game.status === 'playing' && !game.isAnimating) {
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
  }
  window.console.log('---------------------------------------');
  score.textContent = game.getScore();
});
