'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const button = document.querySelector('.start');
const score = document.querySelector('.game-score');

// Write your code here
function initialize() {
  button.addEventListener('click', () => {
    if (button.classList.contains('start')) {
      // Change the button to Reset
      button.className = 'button restart';
      button.textContent = 'Restart';

      // Start the game
      game.start();
    } else {
      // Change the button to Start
      button.className = 'button start';
      button.textContent = 'Start';

      // Restart the game
      game.restart();
      document.removeEventListener('keydown', handleKeyDown);
    }

    document.addEventListener('keydown', handleKeyDown);
  });
}

initialize();

// eslint-disable-next-line no-console
console.log('initialized - end of code');

function handleKeyDown(keyEvent) {
  keyEvent.preventDefault();

  switch (keyEvent.key) {
    case 'ArrowUp':
      if (game.moveTilesUp(game) === true) {
        game.createRandomTile();
        game.printTiles();
        updateScore(game.getScore());
      }
      break;

    case 'ArrowDown':
      if (game.moveTilesDown(game) === true) {
        game.createRandomTile();
        game.printTiles();
        updateScore(game.getScore());
      }
      break;

    case 'ArrowRight':
      if (game.moveTilesRight(game) === true) {
        game.createRandomTile();
        game.printTiles();
        updateScore(game.getScore());
      }
      break;

    case 'ArrowLeft':
      if (game.moveTilesLeft(game) === true) {
        game.createRandomTile();
        game.printTiles();
        updateScore(game.getScore());
      }
      break;
  }
}

function updateScore(newScore) {
  score.textContent = newScore;
}
