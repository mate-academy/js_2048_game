'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class.js');
const game = new Game();

const button = document.querySelector('.start');
const scoreElement = document.querySelector('.game-score');
const fieldCells = document.querySelectorAll('.field-cell');
const fieldCellsArray = Array.from(fieldCells);

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function updateMessage() {
  const gamestatus = game.getStatus();

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (gamestatus === 'idle') {
    startMessage.classList.remove('hidden');
  }

  if (gamestatus === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (gamestatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    updateMessage();
    renderBoard();

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else {
    game.restart();
  }

  renderBoard();
  renderScore();
  updateMessage();
});

function renderBoard() {
  const flatState = game.getState().flat();

  fieldCellsArray.forEach((cell, index) => {
    const value = flatState[index];

    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
    cell.textContent = value || '';
  });
}

function renderScore() {
  scoreElement.textContent = game.getScore();
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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
      return;
  }
  renderBoard();
  renderScore();
  updateMessage();
});
