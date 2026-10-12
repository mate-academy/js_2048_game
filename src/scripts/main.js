'use strict';

import { Game } from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

function updateUI() {
  const board = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  if (scoreElement) {
    scoreElement.textContent = score;
  }

  fieldRows.forEach((rowElement, rowIndex) => {
    const cells = rowElement.querySelectorAll('.field-cell');

    cells.forEach((cell, columnIndex) => {
      const val = board[rowIndex][columnIndex];

      cell.className = 'field-cell';

      if (val > 0) {
        cell.classList.add(`field-cell--${val}`);
        cell.textContent = val;
      } else {
        cell.textContent = '';
      }
    });
  });

  if (gameStatus === 'win' && winMessage) {
    winMessage.classList.remove('hidden');
  } else if (winMessage) {
    winMessage.classList.add('hidden');
  }

  if (gameStatus === 'lose' && loseMessage) {
    loseMessage.classList.remove('hidden');
  } else if (loseMessage) {
    loseMessage.classList.add('hidden');
  }
}

if (startButton) {
  startButton.addEventListener('click', () => {
    if (startButton.classList.contains('start')) {
      game.start();
      startButton.classList.remove('start');
      startButton.classList.add('restart');
      startButton.textContent = 'Restart';

      if (startMessage) {
        startMessage.classList.add('hidden');
      }
    } else {
      game.restart();
    }

    updateUI();
  });
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    default:
      return;
  }

  if (moved) {
    updateUI();
  }
});
