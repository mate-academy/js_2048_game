'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const score = document.querySelector('.game-score');
const notification = document.querySelector('.message-container');

startButton.addEventListener('click', () => {
  if (
    game.getStatus() === 'playing' ||
    game.getStatus() === 'win' ||
    game.getStatus() === 'lose'
  ) {
    game.restart();
    notification.querySelector('.message-win').classList.add('hidden');
    notification.querySelector('.message-lose').classList.add('hidden');
  } else if (game.getStatus() === 'idle') {
    game.start();
    notification.querySelector('.message-start').classList.add('hidden');
    startButton.textContent = 'restart';
  }
  updateUI();
});

function updateUI() {
  const cells = document.querySelectorAll('.field-cell');
  const board = game.getState();

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = cells[row * game.size + col];

      cell.textContent = board[row][col] || '';
      cell.className = `field-cell field-cell--${board[row][col] || 'empty'}`;
    }
  }
  score.textContent = game.getScore();

  if (game.isWin()) {
    notification.querySelector('.message-win').classList.remove('hidden');
  } else if (game.isLose()) {
    notification.querySelector('.message-lose').classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  updateUI();
});
