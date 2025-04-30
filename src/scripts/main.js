'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  game.start();
  renderBoard();
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
});

document.addEventListener('keydown', (evt) => {
  let moved = false;

  switch (evt.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
  }

  if (moved) {
    renderBoard();
    updateGameStatus();
  }
});

function renderBoard() {
  const cells = document.querySelectorAll('.field-cell');
  const board = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
  document.querySelector('.game-score').textContent = game.score;
}

function updateGameStatus() {
  const gameStatus = game.getStatus();
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');
  const startMessage = document.querySelector('.message-start');

  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}
