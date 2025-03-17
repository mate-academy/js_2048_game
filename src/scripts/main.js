'use strict';

import Hammer from 'hammerjs';

// Import the Game class and create a new game instance
const Game = require('../modules/Game.class');
const game = new Game();

// Select DOM elements for the game UI
const gameField = document.querySelector('.game-field');
// const rows = document.querySelectorAll('.field-row');
const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const ANIMATION_DELAY_MS = 200;

// Initialize Hammer.js for game field to handle swipes on mobile
const hammer = new Hammer(gameField);

// Recognize swipes in all directions
hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

// Update the UI based on the current game state
function updateUI() {
  const boardState = game.getState(); // Get the current board state (4x4 array)
  // Parse the previous board state for comparison (used for animations)
  const prevBoardState = JSON.parse(game.prevBoardState);

  let cellIndex = 0; // Index to track the current cell

  // Iterate over each row and column of the board
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cellValue = boardState[row][col]; // Current tile value
      const prevValue = prevBoardState[row][col]; // Previous tile value
      const cell = cells[cellIndex]; // Corresponding DOM cell element

      // Set cell text: show the value if non-zero, otherwise an empty string
      cell.textContent = cellValue || '';

      // Reset the cell’s classes to the base class
      cell.className = 'field-cell';

      // If the tile has a value, apply styles and check for animations
      if (cellValue !== 0) {
        cell.classList.add(`field-cell--${cellValue}`); // Add class based on tile value
        const isNewTile = prevValue === 0 && cellValue !== 0; // Check if tile is new
        const isTileMerged = prevValue !== 0 && prevValue !== cellValue; // Check if tile merged

        // Animate new tiles
        if (isNewTile) {
          cell.classList.add('field-cell--new'); // Add class to trigger appearance animation
          setTimeout(
            () => cell.classList.remove('field-cell--new'), // Remove after animation
            ANIMATION_DELAY_MS,
          );
        }
        // Animate merged tiles
        else if (isTileMerged) {
          cell.classList.add('field-cell--merged');
          setTimeout(
            () => cell.classList.remove('field-cell--merged'),
            ANIMATION_DELAY_MS,
          );
        }
      }

      cellIndex++; // Move to the next cell
    }
  }

  // Update the displayed score
  scoreElement.textContent = game.getScore();

  // Handle game status messages and button state
  handleGameStatus();
}

// Update the visibility of messages and button text based on game status
function handleGameStatus() {
  const gameStatus = game.getStatus();

  // Hide all messages by default
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  // Show the message based on game status
  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }

  // Update the button text and class based on game state
  if (gameStatus !== 'idle') {
    startButton.className = 'button restart';
    startButton.textContent = 'Restart';
  } else {
    startButton.className = 'button start';
    startButton.textContent = 'Start';
  }
}

// Handle Start/Restart button clicks
startButton.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  // Start the game if idle, otherwise restart it
  if (gameStatus === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  updateUI(); // Refresh the UI after starting or restarting
});

// Handle keyboard input for tile movement
document.addEventListener('keydown', (e) => {
  const gameStatus = game.getStatus();

  // Allow movement only if the game is in progress or won (to continue playing)
  if (gameStatus === 'playing' || gameStatus === 'win') {
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

      default:
        return;
    }

    updateUI();
  }
});

// Handling swipe gestures using Hammer.js
hammer.on('swipeleft', () => {
  // Bind the game.moveLeft function to the correct context before calling moveOnSwipe
  moveOnSwipe(game.moveLeft.bind(game));
});

hammer.on('swiperight', () => {
  moveOnSwipe(game.moveRight.bind(game));
});

hammer.on('swipeup', () => {
  moveOnSwipe(game.moveUp.bind(game));
});

hammer.on('swipedown', () => {
  moveOnSwipe(game.moveDown.bind(game));
});

// Move based on swiped direction
function moveOnSwipe(moveInDirection) {
  const gameStatus = game.getStatus();

  if (gameStatus === 'playing' || gameStatus === 'win') {
    moveInDirection();
    updateUI();
  }
}

// Initialize the game UI on page load
function initGame() {
  updateUI();
}

// Set up the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);
