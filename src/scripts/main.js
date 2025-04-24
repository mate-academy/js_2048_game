'use strict';

// Uncomment the next lines to use your game instance in the browser
const HANDLED_KEY_EVENTS = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
document.addEventListener('click', (e) => {
  if (e.target.matches('.restart')) {
    game.restart();
    updateScore();

    return;
  }

  if (e.target.matches('.start')) {
    game.start();
    updateScore();
  }
});

document.addEventListener('keydown', (e) => {
  if (!HANDLED_KEY_EVENTS.includes(e.key)) {
    return;
  }

  if (game.getStatus() === 'idle') {
    game.start();
  }

  if (!game.existsAvailableMove()) {
    game.over();

    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
  }

  updateScore();

  game.waitFor2048(game.getState()).then(() => game.win());
});

function updateScore() {
  const span = document.querySelector('.game-score');

  span.textContent = `${game.getScore()}`;
}
