'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// console.log('Initial Board State:', game.getState());
// console.log('Score:', game.getScore());

function handleKeyPress(key) {
  let moved = false;

  switch (key) {
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      // eslint-disable-next-line no-unused-vars
      moved = game.moveRight();
      break;
  }

  // if (moved) {
  //   // updateUI(game.getState(), game.getScore(), game.getStatus());
  //   console.log('New Board State:', game.getState());
  //   console.log('New Score:', game.getScore());
  // }

  // // Check game status after the move
  // if (game.getStatus() !== 'playing') {
  //   console.log('Game Over! Status:', game.getStatus());
  // }
}

const body = document.querySelector('body');

body.addEventListener('keydown', (e) => {
  handleKeyPress(e.key);
});

const startBtn = document.querySelector('.button.start');

startBtn.addEventListener('click', (e) => {
  game.start();
});

const scoreEl = document.querySelector('.game-score');

scoreEl.textContent = game.getScore();
