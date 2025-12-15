'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here
const startButton = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');

function updateUI() {
  const state = game.getState();
  const score = game.getScore();

  // Update score
  scoreElement.textContent = score;

  // Update board cells
  state.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cellIndex = rowIndex * 4 + colIndex;
      const cell = cells[cellIndex];

      // Remove only field-cell--* classes, preserve other classes
      Array.from(cell.classList).forEach((className) => {
        if (className.startsWith('field-cell--')) {
          cell.classList.remove(className);
        }
      });

      // Update cell content and class
      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
      }
    });
  });

  // Update messages based on status
  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}

function handleStart() {
  if (game.getStatus() === 'idle') {
    game.start();
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  }
  updateUI();
}

function handleKeyPress(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      game.moveLeft();
      break;
    case 'ArrowRight':
      e.preventDefault();
      game.moveRight();
      break;
    case 'ArrowUp':
      e.preventDefault();
      game.moveUp();
      break;
    case 'ArrowDown':
      e.preventDefault();
      game.moveDown();
      break;
    default:
      return;
  }

  updateUI();
}

// Event listeners
startButton.addEventListener('click', handleStart);
document.addEventListener('keydown', handleKeyPress);

// Initialize UI
updateUI();
