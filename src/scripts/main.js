'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const button = document.querySelector('.button');

if (button) {
  button.addEventListener('click', () => {
    if (button.classList.contains('start')) {
      game.start();
      game.setStatus('playing');
      startGameLoop();
    } else if (button.classList.contains('restart')) {
      game.restart();
      game.setStatus('idle');
      startGameLoop();
    }
  });
}

let gameLoop;

function startGameLoop() {
  clearInterval(gameLoop);

  gameLoop = setInterval(() => {
    const newStatus = game.getStatus();

    if (newStatus === 'win') {
      game.winWindow();
      clearInterval(gameLoop);
    } else if (newStatus === 'lose') {
      game.loseWindow();
      clearInterval(gameLoop);
    }
  }, 100);
}

document.addEventListener('keydown', (eve) => {
  if (!game.isPlaying()) {
    return;
  }

  if (eve.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (eve.key === 'ArrowRight') {
    game.moveRight();
  } else if (eve.key === 'ArrowUp') {
    game.moveUp();
  } else if (eve.key === 'ArrowDown') {
    game.moveDown();
  }
});
