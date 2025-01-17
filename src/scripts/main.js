'use strict';

const Game = require('../modules/Game.class');

const game = new Game();
const startButton = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const fieldCells = document.querySelectorAll('.field-cell');

function renderGrid() {
  const grid = game.getState();

  fieldCells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = grid[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
  });
  scoreElement.textContent = game.getScore();
}

// eslint-disable-next-line no-shadow
function handleKeyPress(event) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (event.key) {
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

  renderGrid();
  checkGameStatus();
}

function checkGameStatus() {
  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
  renderGrid();
});

document.addEventListener('keydown', handleKeyPress);
