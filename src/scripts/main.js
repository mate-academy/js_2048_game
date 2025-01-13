'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

// DOM Elements
const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const statusMessage = document.getElementById('status');
const startButton = document.getElementById('start');

// Render the board
function renderBoard() {
  boardElement.innerHTML = '';

  const state = game.getState();

  state.forEach((row) => {
    row.forEach((cell) => {
      const cellElement = document.createElement('div');

      cellElement.className = `field-cell field-cell--${cell || 'empty'}`;
      cellElement.textContent = cell || '';
      boardElement.appendChild(cellElement);
    });
  });
}

// Update the score
function updateScore() {
  scoreElement.textContent = game.getScore();
}

// Update game status
function updateStatus() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    statusMessage.textContent = 'You win!';
  } else if (gameStatus === 'lose') {
    statusMessage.textContent = 'Game over!';
  } else {
    statusMessage.textContent = '';
  }
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
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
    renderBoard();
    updateScore();
    updateStatus();
  }
});

// Start button handler
startButton.addEventListener('click', () => {
  game.start();
  renderBoard();
  updateScore();
  updateStatus();
});

// Initialize game
game.start();
renderBoard();
updateScore();
