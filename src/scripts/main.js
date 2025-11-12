'use strict';

// The require() syntax is CommonJS, which is fine for the provided setup.
const Game = require('../modules/Game.class');
const game = new Game();

// --- DOM Elements ---
const startBtn = document.querySelector('.button.start');
const scoreEl = document.querySelector('.game-score');
const cells = Array.from(document.querySelectorAll('.field-cell'));

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

// --- UI Logic ---

/**
 * Renders the current board state and score to the UI.
 * @param {number[]} board - The 16-element board array.
 * @param {number} score - The current score.
 */
function renderUI(board, score) {
  // Update Score
  scoreEl.textContent = score;

  // Update Board Tiles
  board.forEach((value, index) => {
    const cell = cells[index];

    // 1. Remove all old class names starting with 'field-cell--'
    cell.className = 'field-cell';

    // 2. Set the content and tile class
    if (value !== 0) {
      cell.textContent = value;
      // Add the styling class, e.g., 'field-cell--2', 'field-cell--2048'
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });
}

/**
 * Manages the visibility of the game status messages and the button text/class.
 */
function updateGameFlowUI() {
  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  // Hide all messages first
  [startMessage, winMessage, loseMessage].forEach((el) => {
    el.classList.add('hidden');
  });

  startBtn.classList.remove('start', 'restart');

  switch (status) {
    case 'idle':
      startMessage.classList.remove('hidden');
      startBtn.textContent = 'Start';
      startBtn.classList.add('start');
      break;
    case 'playing':
      // Hide the start message if a move has been made
      if (game.getScore() > 0 || game.getState().some((val) => val !== 0)) {
        startBtn.textContent = 'Restart';
        startBtn.classList.add('restart');
      } else {
        startBtn.textContent = 'Start';
        startBtn.classList.add('start');
      }
      break;
    case 'won':
      winMessage.classList.remove('hidden');
      startBtn.textContent = 'Restart';
      startBtn.classList.add('restart');
      break;
    case 'lost':
      loseMessage.classList.remove('hidden');
      startBtn.textContent = 'Restart';
      startBtn.classList.add('restart');
      break;
  }
}

// --- Game Control Functions ---

/**
 * Handles the logic for a key press (movement).
 * @param {string} key - The key pressed (e.g., 'ArrowUp').
 */
function handleKeyPress(key) {
  let moved = false;

  if (game.getStatus() !== 'playing') {
    return;
  }

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
      moved = game.moveRight();
      break;
  }

  if (moved) {
    renderUI(game.getState(), game.getScore());
    updateGameFlowUI();
  }
}

/**
 * Starts or Restarts the game.
 */
function handleStartRestart() {
  game.restart(); // Start and restart call the same logic
  renderUI(game.getState(), game.getScore());
  updateGameFlowUI();
}

// --- Event Listeners and Initialization ---

// 1. Keyboard Input
document.addEventListener('keydown', (e) => {
  // Prevent default arrow key scrolling
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
  handleKeyPress(e.key);
});

// 2. Start/Restart Button
startBtn.addEventListener('click', handleStartRestart);

// 3. Initial UI Setup (runs on page load)
document.addEventListener('DOMContentLoaded', () => {
  // The game starts in 'idle' status by default.
  // We don't call game.start() here.
  renderUI(game.getState(), game.getScore());
  updateGameFlowUI();
});
