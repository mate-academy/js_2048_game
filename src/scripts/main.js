'use strict';

import Game from '../modules/Game.class';

const game = new Game();

// DOM Elements
const cells = document.querySelectorAll('.field-cell');
const scoreValue = document.querySelector('.score-value');
const actionButton = document.querySelector('.button');
const startMessage =
  document.querySelector('.message-start') ||
  document.querySelector('.message')[0];
const winMessage = document.querySelector('.message-win');
const el = document.querySelector('.message-lose');
const loseMessage = el || document.querySelectorAll('.message')[2];

let isGameStarted = false;

function updateUI() {
  const state = game.getState().flat();
  const gameStatus = game.getStatus();

  // 1. Update Score
  if (scoreValue) {
    scoreValue.textContent = game.getScore();
  }

  // 2. Update Cells
  cells.forEach((cell, index) => {
    const value = state[index];

    // Reset to base class
    cell.className = 'field-cell';

    // Apply specific number class and text if not empty
    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    } else {
      cell.textContent = '';
    }
  });

  // 3. Handle End Game Messages
  if (gameStatus === 'won' && winMessage) {
    winMessage.classList.remove('hidden');
  } else if (gameStatus === 'game over' && loseMessage) {
    loseMessage.classList.remove('hidden');
  }
}

function handleFirstMove() {
  if (!isGameStarted) {
    isGameStarted = true;

    // Change Start button to Restart
    if (actionButton) {
      actionButton.classList.remove('start');
      actionButton.classList.add('restart');
      actionButton.textContent = 'Restart';
    }

    // Hide the initial start message
    if (startMessage) {
      startMessage.classList.add('hidden');
    }
  }
}

// Listen  for keyword arrows
document.addEventListener('keydown', (e) => {
  // Prevent moving if the game is over hasn't started
  if (game.getStatus() !== 'playing') {
    return;
  }

  const prevState = JSON.stringify(game.getState());

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }

  const newState = JSON.stringify(game.getState());

  // Only trigger UI updates and game changes if the board actually moved
  if (prevState !== newState) {
    handleFirstMove();
    updateUI();
  }
});

// Listen for Start / Restart button clicks
if (actionButton) {
  actionButton.addEventListener('click', () => {
    if (actionButton.classList.contains('start')) {
      game.start();
      handleFirstMove();
    } else {
      game.restart();
      game.start(); // Auto-start immediately after restarting

      // Hide won / game over messages on restart
      if (winMessage) {
        winMessage.classList.add('hidden');
      }

      if (loseMessage) {
        loseMessage.classList.add('hidden');
      }
    }
    updateUI();
  });
}
