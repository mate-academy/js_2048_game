'use strict';

import Game from '../modules/Game.class';

// Write your code here
const game = new Game();

const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const bestScoreElement = document.querySelector('.best-score');
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
  bestScoreElement.textContent = game.bestScore;
}

function updateScore() {
  scoreElement.textContent = game.getScore();
  bestScoreElement.textContent = game.bestScore;
}

function checkGameStatus() {
  const stat = game.getStatus();

  if (stat === 'win') {
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');
    startButton.classList.replace('restart', 'start');
    startButton.textContent = 'Start';
  }

  if (stat === 'lose') {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
  }

  if (stat === 'playing') {
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }

  if (stat === 'idle') {
    messageStart.textContent = 'Press "Start" to begin game. Good luck!';
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  renderGrid();
  updateScore();
  checkGameStatus();
});

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    messageWin.classList.add('hidden');

    game.score = 0;
    updateScore();
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');

    game.score = 0;
    updateScore();
  }

  renderGrid();
});
