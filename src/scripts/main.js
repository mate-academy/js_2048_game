'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const game = new Game();

const startButton = document.querySelector('.button');
const animationButton = document.querySelector('h1');

startButton.onclick = () => {
  if (startButton.textContent === 'Start') {
    game.start();
  } else {
    game.restart();
  }
};

animationButton.onclick = () => {
  game.animation();
};

addEventListener('keydown', (events) => {
  switch (events.key) {
    case 'ArrowUp':
      game.move('up');
      break;
    case 'ArrowDown':
      game.move('down');
      break;
    case 'ArrowRight':
      game.move('right');
      break;
    case 'ArrowLeft':
      game.move('left');
      break;
  }
});
