'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

// Initialize the game
initialize();

function initialize() {
  button.addEventListener('click', () => {
    // If we start the game
    if (button.classList.contains('start')) {
      // Switch button to a `restart` button
      button.className = 'button restart';
      button.textContent = 'Restart';

      // Remove game notification
      messageStart.classList.add('hidden');

      // Start the game
      game.start();
    } else {
      // We restart the game
      // Switch button to a `start` button
      button.className = 'button start';
      button.textContent = 'Start';

      // Remove game notifications
      messageStart.classList.remove('hidden');
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');

      // Stop listening for arrow clicks
      document.removeEventListener('keydown', handleKeyDown);

      // restart the game
      game.restart();
    }

    // Start listening for arrow clicks
    document.addEventListener('keydown', handleKeyDown);
  });
}

function handleKeyDown(keyEvent) {
  // Prevent accidental page scrolling
  keyEvent.preventDefault();

  // Store info whether tiles moved
  let didTilesMove = false;

  // Check which arrow was pressed
  switch (keyEvent.key) {
    case 'ArrowUp':
      didTilesMove = game.moveUp();
      break;

    case 'ArrowDown':
      didTilesMove = game.moveDown();
      break;

    case 'ArrowRight':
      didTilesMove = game.moveRight();
      break;

    case 'ArrowLeft':
      didTilesMove = game.moveLeft();
      break;
  }

  // If arrow was pressed & any tiles moved
  if (didTilesMove) {
    // Update score on the page
    updateScore(game.getScore());

    // Get current game status
    const currentGameStatus = game.getStatus();

    // Check whether game is finished and handle state
    if (currentGameStatus === Game.Status.lose) {
      handleLostGame();
    } else if (currentGameStatus === Game.Status.win) {
      handleWonGame();
    }
  }
}

function handleLostGame() {
  messageLose.classList.remove('hidden');
}

function handleWonGame() {
  messageWin.classList.remove('hidden');
}

function updateScore(newScore) {
  score.textContent = newScore;
}
