'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.start');
const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

function updateBoard() {
  const board = game.getState();

  scoreElement.textContent = game.getScore();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  if (game.getStatus() === 'playing') {
    messageStart.classList.add('hidden');
  }

  if (game.getStatus() === 'playing') {
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
  }

  game.checkLose();
  game.checkWin();

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');

    return;
  }

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');

    return;
  }

  if (startBtn.textContent !== 'Restart') {
    startBtn.textContent = 'Restart';
  }
}

startBtn.addEventListener('click', () => {
  game.start();
  updateBoard();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      updateBoard();
      break;
    case 'ArrowRight':
      game.moveRight();
      updateBoard();
      break;
    case 'ArrowUp':
      game.moveUp();
      updateBoard();
      break;
    case 'ArrowDown':
      game.moveDown();
      updateBoard();
      break;
    default:
  }
});
