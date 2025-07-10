'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

function renderBoard() {
  const cells = document.querySelectorAll('.field-cell');


  for (let i = 0; i < cells.length; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = game.board[row][col];
    const cell = cells[i];

    cell.className = 'field-cell';

    if (value === 0) {
      cell.textContent = '';
    } else {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  }
}

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  game.start();
  renderBoard();
  updateScore();
  updateMessage();
  toggleButtons();
});

const restartButton = document.querySelector('.button.restart');

restartButton.addEventListener('click', () => {
  game.restart();
  updateScore();
  renderBoard();
  updateMessage();
  toggleButtons();
});

function toggleButtons() {
  if (game.getStatus() === 'idle') {
    startButton.classList.remove('hidden');
    restartButton.classList.add('hidden');
  } else {
    startButton.classList.add('hidden');
    restartButton.classList.remove('hidden');
  }
}

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      updateScore();
      renderBoard();
      updateMessage();
      game.updateStatus();

      break;
    case 'ArrowRight':
      game.moveRight();
      updateScore();
      renderBoard();
      updateMessage();
      game.updateStatus();

      break;
    case 'ArrowUp':
      game.moveUp();
      updateScore();
      renderBoard();
      updateMessage();
      game.updateStatus();

      break;
    case 'ArrowDown':
      game.moveDown();
      updateScore();
      renderBoard();
      updateMessage();
      game.updateStatus();

      break;
  }

  renderBoard();
});

const scoreElement = document.querySelector('.game-score');

function updateScore() {
  scoreElement.textContent = game.getScore();
  renderBoard();
}

function updateMessage() {
  const win = document.querySelector('.message-win');
  const lose = document.querySelector('.message-lose');
  const start = document.querySelector('.message-start');
  const statusGame = game.getStatus();

  win.classList.add('hidden');
  lose.classList.add('hidden');
  start.classList.add('hidden');

  if (statusGame === 'win') {
    win.classList.remove('hidden');
  } else if (statusGame === 'lose') {
    lose.classList.remove('hidden');
  } else if (statusGame === 'idle') {
    start.classList.remove('hidden');
  }
}
