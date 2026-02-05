'use strict';

// const bobik = [
//   [2, 4, 8, 16],
//   [16, 8, 4, 2],
//   [2, 4, 8, 16],
//   [16, 4, 4, 0],
// ];

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    game.restart();
  } else {
    game.start();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.blocked) {
    return;
  }

  const gameKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
  const pressedKey = e.key;

  if (
    startButton.classList.contains('start') &&
    gameKeys.includes(pressedKey)
  ) {
    game.start();
  }

  switch (pressedKey) {
    case 'ArrowRight':
      game.moveRight();

      break;
    case 'ArrowLeft':
      game.moveLeft();

      break;
    case 'ArrowUp':
      game.moveUp();

      break;
    case 'ArrowDown':
      game.moveDown();

      break;
  }
});
