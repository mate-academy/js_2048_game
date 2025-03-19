'use strict';

import Game from './modules/Game.class.js';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const statusElement = document.querySelector('.message-container');
const startButton = document.querySelector('.button.start');

function renderBoard() {
  const cells = document.querySelectorAll('.field-cell');
  const state = game.getState();

  state.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellElement = cells[i * 4 + j];

      cellElement.textContent = cell !== 0 ? cell : '';
      cellElement.className = 'field-cell';

      if (cell !== 0) {
        cellElement.classList.add(`field-cell--${cell}`);
      }
    });
  });
}

function updateScore() {
  scoreElement.textContent = game.getScore();
}

function updateStatus() {
  const currentStatus = game.getStatus();

  if (currentStatus === 'win') {
    statusElement.querySelector('.message-win').classList.remove('hidden');
    statusElement.querySelector('.message-lose').classList.add('hidden');
    statusElement.querySelector('.message-start').classList.add('hidden');
  } else if (currentStatus === 'lose') {
    statusElement.querySelector('.message-lose').classList.remove('hidden');
    statusElement.querySelector('.message-win').classList.add('hidden');
    statusElement.querySelector('.message-start').classList.add('hidden');
  } else {
    statusElement.querySelector('.message-start').classList.remove('hidden');
    statusElement.querySelector('.message-win').classList.add('hidden');
    statusElement.querySelector('.message-lose').classList.add('hidden');
  }
}

function handleMove(direction) {
  if (game.getStatus() === 'playing') {
    switch (direction) {
      case 'left':
        game.moveLeft();
        break;
      case 'right':
        game.moveRight();
        break;
      case 'up':
        game.moveUp();
        break;
      case 'down':
        game.moveDown();
        break;
    }

    renderBoard();
    updateScore();
    updateStatus();
  }
}

startButton.addEventListener('click', () => {
  const currentStatus = game.getStatus();

  if (currentStatus === 'idle') {
    game.start();
  } else if (currentStatus === 'win' || currentStatus === 'lose') {
    game.restart();
  }

  startButton.textContent = 'Restart';
  renderBoard();
  updateScore();
  updateStatus();
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      handleMove('left');
      break;
    case 'ArrowRight':
      handleMove('right');
      break;
    case 'ArrowUp':
      handleMove('up');
      break;
    case 'ArrowDown':
      handleMove('down');
      break;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderBoard();
  updateScore();
  updateStatus();
});
