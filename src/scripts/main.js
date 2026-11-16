'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const gameField = document.querySelector('.game-field');
const tableRows = gameField.querySelectorAll('.field-row');

// Game field initiation
function gameState(state) {
  tableRows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, cellIndex) => {
      const value = state[rowIndex][cellIndex];

      cell.className = 'field-cell';
      cell.textContent = value === 0 ? '' : value;

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });
}

gameState(game.getState());

// Start/Restart buttons initialion
const startRestartButton = document.querySelector('.start');
const score = document.querySelector('.game-score');

startRestartButton.addEventListener('click', () => {
  const startMessage = document.querySelector('.message-start');

  if (game.getStatus() === 'idle') {
    game.start();
    score.textContent = game.getScore();
    startRestartButton.textContent = 'Restart';
    startRestartButton.classList.remove('start');
    startRestartButton.classList.add('restart');
    startMessage.classList.add('hidden');
  } else {
    game.restart();
    score.textContent = 0;
    startRestartButton.textContent = 'Start';
    startRestartButton.classList.remove('restart');
    startRestartButton.classList.add('start');
    startMessage.classList.remove('hidden');

    if (!document.querySelector('.message-win').classList.contains('hidden')) {
      document.querySelector('.message-win').classList.add('hidden');
    }

    if (!document.querySelector('.message-lose').classList.contains('hidden')) {
      document.querySelector('.message-lose').classList.add('hidden');
    }
  }

  gameState(game.getState());
});

// Events on ArrowKeys pressed down
document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (!arrowKeys.includes(e.key)) {
    return;
  }

  e.preventDefault();

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

  gameState(game.getState());
  score.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
});
