'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const button = document.querySelector('.button');
const score = document.querySelector('.game-score');

button.addEventListener('click', (ev) => {
  if (button.classList.contains('start')) {
    game.start(button);
  } else {
    game.restart(button);
    score.innerHTML = game.getScore();
  }
});

document.addEventListener('keydown', (evnt) => {
  if (game.getStatus() === 'playing') {
    switch (evnt.key) {
      case 'ArrowDown':
        game.moveDown();
        break;

      case 'ArrowUp':
        game.moveUp();
        break;

      case 'ArrowLeft':
        game.moveLeft();
        break;

      case 'ArrowRight':
        game.moveRight();
        break;
    }
  }

  score.innerHTML = game.getScore();
});
