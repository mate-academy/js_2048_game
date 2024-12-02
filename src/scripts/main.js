'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Start and restart Game (change button)

// Write your code here
// Методи руху по полю

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      return 0;
  }

  updateUI();
});

function updateUI() {
  const board = game.getState();

  const rows = document.querySelectorAll('.field-row');

  rows.forEach((rowElement, rowIndex) => {
    const cells = rowElement.querySelectorAll('.field-cell');

    cells.forEach((cell, cellIndex) => {
      const value = board[rowIndex][cellIndex];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });

  const scoreElement = document.querySelector('.game-score');

  scoreElement.textContent = game.getScore();

  updateStatus();
}

function updateStatus() {
  const statusGame = game.getStatus();

  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (statusGame === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (statusGame === 'win') {
    messageWin.classList.remove('hidden');
  } else if (statusGame === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startButton.classList.replace('start', 'restart');
    startButton.textContent = 'Restart';
  }
  game.start();
  updateUI();
});
