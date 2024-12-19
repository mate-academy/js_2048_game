'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const messages = {
  start: document.querySelector('.message-start'),
  win: document.querySelector('.message-win'),
  lose: document.querySelector('.message-lose'),
};

function updateUI() {
  const board = game.getState();

  cells.forEach((cell, index) => {
    const x = Math.floor(index / 4);
    const y = index % 4;
    const value = board[x][y];

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
    cell.textContent = value || '';
  });

  scoreElement.textContent = game.getScore();

  Object.keys(messages).forEach((key) => {
    messages[key].classList.add('hidden');
  });

  if (game.getStatus() === 'idle') {
    messages.start.classList.remove('hidden');
  } else if (game.getStatus() === 'win') {
    messages.win.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messages.lose.classList.remove('hidden');
  }

  if (game.getStatus() === 'playing' || game.getStatus() === 'lose') {
    startButton.textContent = 'Restart';
  } else {
    startButton.textContent = 'Start';
  }

  startButton.classList.add('restart');
}

startButton.addEventListener('click', () => {
  game.restart();
  updateUI();
});

document.addEventListener('keydown', (ev) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (ev.key) {
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
});
