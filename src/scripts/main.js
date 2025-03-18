'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const statusElement = document.getElementById('status');
const startButton = document.getElementById('start-button');

function renderBoard() {
  boardElement.innerHTML = '';

  const state = game.getState();

  state.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellElement = document.createElement('div');

      cellElement.classList.add('field-cell');

      if (cell !== 0) {
        cellElement.classList.add(`field-cell--${cell}`);
        cellElement.textContent = cell;
      }

      boardElement.appendChild(cellElement);
    });
  });
}

function updateScore() {
  scoreElement.textContent = `Score: ${game.getScore()}`;
}

function updateStatus() {
  const currentStatus = game.getStatus();

  statusElement.textContent = `Status: ${currentStatus}`;

  if (currentStatus === 'win' || currentStatus === 'lose') {
    startButton.textContent = 'Restart';
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

renderBoard();
updateScore();
updateStatus();
