'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

import Game from './modules/Game.class.js';

const game = new Game();
const boardElement = document.querySelector('.field');
const scoreElement = document.querySelector('.score');
const statusElement = document.querySelector('.status');

function renderBoard() {
  boardElement.innerHTML = '';

  const state = game.getState();

  state.forEach((row) => {
    row.forEach((cell) => {
      const cellElement = document.createElement('div');

      cellElement.className = `field-cell ${cell ? `field-cell--${cell}` : ''}`;
      cellElement.textContent = cell || '';
      boardElement.appendChild(cellElement);
    });
  });
}

function updateScore() {
  scoreElement.textContent = `Score: ${game.getScore()}`;
}

function checkStatus() {
  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  if (status !== 'playing') {
    statusElement.textContent = status === 'won' ? 'You won!' : 'Game over!';
  } else {
    statusElement.textContent = '';
  }
}

// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
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
  }

  renderBoard();
  updateScore();
  checkStatus();
});

document.querySelector('.start').addEventListener('click', () => {
  game.restart();
  renderBoard();
  updateScore();
  checkStatus();
});

game.start();
renderBoard();
updateScore();
checkStatus();
