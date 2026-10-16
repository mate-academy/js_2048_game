'use strict';

import { Game } from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.button');
const scoreContainer = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

function renderBoard() {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  if (scoreContainer) {
    scoreContainer.textContent = score;
  }

  let index = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = cells[index];
      const val = state[r][c];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (val > 0) {
        cell.classList.add(`field-cell--${val}`);
        cell.textContent = val;
      }

      index += 1;
    }
  }

  if (startMessage && gameStatus === 'playing') {
    startMessage.classList.add('hidden');
  }

  if (winMessage) {
    if (gameStatus === 'win') {
      winMessage.classList.remove('hidden');
    } else {
      winMessage.classList.add('hidden');
    }
  }

  if (loseMessage) {
    if (gameStatus === 'lose') {
      loseMessage.classList.remove('hidden');
    } else {
      loseMessage.classList.add('hidden');
    }
  }
}

if (startButton) {
  startButton.addEventListener('click', () => {
    game.restart();
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    renderBoard();
  });
}

document.addEventListener('keydown', (keyEvent) => {
  let moved = false;

  switch (keyEvent.key) {
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
    if (startButton && startButton.classList.contains('start')) {
      startButton.textContent = 'Restart';
      startButton.classList.remove('start');
      startButton.classList.add('restart');
    }

    renderBoard();
  }
});
