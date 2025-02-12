'use strict';

// Uncomment the next lines to use your game instance in the browser

// document.getElementById('start-restart-btn').addEventListener(
// 'click', () => {

import Game from '../modules/Game.class.js';

const game2048 = new Game();
const button = document.querySelector('.start-restart-btn');

button.addEventListener('click', () => {
  if (game2048.getStatus() === 'idle') {
    game2048.start();
  } else {
    game2048.restart();
  }
});

document.addEventListener('keydown', (e) => {
  if (game2048.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game2048.moveLeft();
      break;
    case 'ArrowRight':
      game2048.moveRight();
      break;
    case 'ArrowUp':
      game2048.moveUp();
      break;
    case 'ArrowDown':
      game2048.moveDown();
      break;
  }

  if (game2048.getStatus() === 'gameover') {
    alert('Game Over!');
  }
});
