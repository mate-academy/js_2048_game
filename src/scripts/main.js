'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const fieldCells = document.querySelectorAll('.field-cell');

const KEY_LEFT = 'ArrowLeft';
const KEY_RIGHT = 'ArrowRight';
const KEY_UP = 'ArrowUp';
const KEY_DOWN = 'ArrowDown';

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
    case KEY_LEFT:
      game.moveLeft();
      break;
    case KEY_RIGHT:
      game.moveRight();
      break;
    case KEY_UP:
      game.moveUp();
      break;
    case KEY_DOWN:
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
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.remove('hidden');
  }
  renderGrid();
});

document.addEventListener('keydown', handleKeyPress);
