'use strict';

import Game from '../modules/Game.class';

const game = new Game();

// Write your code here

const startButton = document.querySelector('.button.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function updateMessage(stat) {
  if (stat === 'lose') {
    messageLose.classList.remove('hidden');
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  if (stat === 'win') {
    messageWin.classList.remove('hidden');
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
  }

  if (stat === 'playing') {
    messageStart.textContent = 'Playing';
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  if (stat === 'idle') {
    messageStart.textContent = 'Press "Start" to begin game. Good luck!';
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }
}

startButton.addEventListener('click', () => {
  game.start();
  updateBoard();
  updateScore();
  startButton.classList.replace('start', 'restart');
  startButton.textContent = 'Restart';
  updateMessage(game.getStatus());
});

document.querySelector('.button.start').addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    game.restart();
  } else {
    game.start();
    startButton.classList.replace('start', 'restart');
    startButton.textContent = 'Restart';
  }
  updateScore();
  updateMessage(game.getStatus());
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  updateBoard();
  updateScore();
  updateMessage(game.getStatus());
});

function updateBoard() {
  const state = game.getState();
  const field = document.querySelector('.game-field');
  const rows = field.querySelectorAll('.field-row');

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, colIndex) => {
      const value = state[rowIndex][colIndex];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });
}

function updateScore() {
  const scoreElement = document.querySelector('.game-score');
  const bestScoreElement = document.querySelector('.best-score');

  scoreElement.textContent = game.getScore();
  bestScoreElement.textContent = game.bestScore;
}
