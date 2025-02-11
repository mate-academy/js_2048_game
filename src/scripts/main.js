'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const scoreElement = document.querySelector('.game-score');
const boardElement = document.querySelector('.game-field tbody');
const startButton = document.querySelector('.start');
const messages = document.querySelector('.message-container');

function updateUI() {
  scoreElement.textContent = game.getScore();

  const board = game.getState();

  boardElement.querySelectorAll('.field-cell').forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;

    cell.textContent = board[row][col] !== 0 ? board[row][col] : '';
    cell.className = `field-cell value-${board[row][col] || 0}`;
  });

  messages
    .querySelector('.message-win')
    .classList.toggle('hidden', game.getStatus() !== 'win');

  messages
    .querySelector('.message-lose')
    .classList.toggle('hidden', game.getStatus() !== 'lose');
}

document.addEventListener('keydown', (e) => {
  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (moves[e.key]) {
    moves[e.key]();
    updateUI();
  }
});

startButton.addEventListener('click', () => {
  game.restart();
  updateUI();
});

updateUI();
