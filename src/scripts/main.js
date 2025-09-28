'use strict';

import { Game } from '../modules/Game.New.js';

const game = new Game();
const boardElement = document.querySelector('.game-board');
const scoreElement = document.querySelector('.score');
const messageElement = document.querySelector('.message');
const startButton = document.querySelector('.start');

function updateUI() {
  boardElement.innerHTML = '';

  game.getState().forEach((row) => {
    row.forEach((value) => {
      const cell = document.createElement('div');

      cell.classList.add('field-cell');

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
      cell.textContent = value || '';
      boardElement.appendChild(cell);
    });
  });
  scoreElement.textContent = `Score: ${game.getScore()}`;
  checkGameStatus();
}

function checkGameStatus() {
  if (game.getStatus() === 'won') {
    messageElement.textContent = 'You Win!';
    messageElement.classList.remove('hidden');
  } else if (game.getStatus() === 'game over') {
    messageElement.textContent = 'Game Over!';
    messageElement.classList.remove('hidden');
  } else {
    messageElement.classList.add('hidden');
  }
}

document.addEventListener('keydown', (e) => {
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
  updateUI();
});

startButton.addEventListener('click', () => {
  game.restart();
  updateUI();
  startButton.textContent = 'Restart';
});

updateUI();
