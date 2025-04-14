'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class.js');
const game = new Game();

const startButton = document.querySelector('button');
let gameStarted = false;

function handleKeyPress(e) {
  if (!gameStarted) {
    gameStarted = true;
    game.start();
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  game.updateScoreDisplay();
  game.checkGameStatus();
}

document.addEventListener('keydown', handleKeyPress);

startButton.addEventListener('click', () => {
  if (!gameStarted) {
    game.start();
    startButton.textContent = 'Restart';
    gameStarted = true;
  } else {
    game.restart();
    startButton.textContent = 'Start';
    gameStarted = false;
  }

  startButton.classList.toggle('start');
  startButton.classList.toggle('restart');

  game.updateScoreDisplay();
  game.checkGameStatus();
});
