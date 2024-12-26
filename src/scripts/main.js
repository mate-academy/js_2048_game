'use strict';

import Game from './modules/Game.class.js';

const game = new Game();
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const statusDisplay = document.getElementById('status');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

function renderBoard() {
  gameBoard.innerHTML = '';

  const state = game.getState();

  state.forEach((row) => {
    row.forEach((cell) => {
      const tile = document.createElement('div');

      tile.classList.add('tile', `tile-${cell}`);
      tile.textContent = cell !== 0 ? cell : '';
      gameBoard.appendChild(tile);
    });
  });
}

function updateScore() {
  scoreDisplay.textContent = game.getScore();
}

function updateStatus() {
  statusDisplay.textContent =
    game.getStatus().charAt(0).toUpperCase() + game.getStatus().slice(1);

  if (game.getStatus() === 'won' || game.getStatus() === 'lose') {
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  } else {
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
  }
}

// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
  if (game.getStatus() === 'playing') {
    if (event.key === 'ArrowLeft') {
      game.moveLeft();
    } else if (event.key === 'ArrowRight') {
      game.moveRight();
    } else if (event.key === 'ArrowUp') {
      game.moveUp();
    } else if (event.key === 'ArrowDown') {
      game.moveDown();
    }

    renderBoard();
    updateScore();
    updateStatus();
  }
});

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    renderBoard();
    updateScore();
    updateStatus();
  } else {
    game.restart();
    renderBoard();
    updateScore();
    updateStatus();
  }
});

restartButton.addEventListener('click', () => {
  game.restart();
  renderBoard();
  updateScore();
  updateStatus();
});

window.onload = () => {
  renderBoard();
  updateScore();
  updateStatus();
};
