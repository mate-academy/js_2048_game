'use strict';

// Import Game class from modules
import Game from '../modules/Game.class.js';

// Create game instance
const game = new Game();

// DOM elements
const startButton = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const gameField = document.querySelector('.game-field');

// Game state tracking
let gameStarted = false;
let gameWon = false;

/**
 * Updates the visual board based on game state
 */
function updateBoard() {
  const state = game.getState();
  const rows = gameField.querySelectorAll('.field-row');

  for (let row = 0; row < 4; row++) {
    const cells = rows[row].querySelectorAll('.field-cell');

    for (let col = 0; col < 4; col++) {
      const cell = cells[col];
      const value = state[row][col];

      // Clear all value classes
      cell.className = 'field-cell';
      cell.textContent = '';

      // Add value class and content if not empty
      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
    }
  }
}

/**
 * Updates the score display
 */
function updateScore() {
  scoreElement.textContent = game.getScore();
}

/**
 * Updates the game status messages
 */
function updateMessages() {
  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  // Hide all messages first
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  switch (status) {
    case 'idle':
      startMessage.classList.remove('hidden');
      break;
    case 'win':
      if (!gameWon) {
        winMessage.classList.remove('hidden');
        gameWon = true;
      }
      break;
    case 'lose':
      loseMessage.classList.remove('hidden');
      break;
  }
}

/**
 * Updates the start/restart button
 */
function updateButton() {
  if (gameStarted) {
    startButton.textContent = 'Restart';
    startButton.className = 'button restart';
  } else {
    startButton.textContent = 'Start';
    startButton.className = 'button start';
  }
}

/**
 * Updates the entire game display
 */
function updateDisplay() {
  updateBoard();
  updateScore();
  updateMessages();
  updateButton();
}

/**
 * Handles game start/restart
 */
function handleStartRestart() {
  if (gameStarted) {
    // Restart game
    game.restart();
    gameWon = false;
  } else {
    // Start game
    game.start();
    gameStarted = true;
  }

  updateDisplay();
}

/**
 * Handles keyboard input for game moves
 */
// eslint-disable-next-line no-shadow
function handleKeyPress(event) {
  // Only handle moves if game is playing
  if (game.getStatus() !== 'playing') {
    return;
  }

  const previousState = JSON.stringify(game.getState());
  const previousScore = game.getScore();

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      game.moveLeft();
      break;
    case 'ArrowRight':
      event.preventDefault();
      game.moveRight();
      break;
    case 'ArrowUp':
      event.preventDefault();
      game.moveUp();
      break;
    case 'ArrowDown':
      event.preventDefault();
      game.moveDown();
      break;
    default:
      return; // Don't update display for other keys
  }

  // Check if a move was made
  const currentState = JSON.stringify(game.getState());
  const currentScore = game.getScore();

  if (previousState !== currentState || previousScore !== currentScore) {
    updateDisplay();
  }
}

/**
 * Initialize the game interface
 */
function init() {
  // Set up event listeners
  startButton.addEventListener('click', handleStartRestart);
  document.addEventListener('keydown', handleKeyPress);

  // Initial display update
  updateDisplay();
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
