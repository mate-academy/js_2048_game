'use strict';

import { Game } from './Game.class.js';

const game = new Game();

const button = document.querySelector('.button.start');
const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

button.addEventListener('click', () => {
  game.restart();
  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');
  render();
  hideMessages();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
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

  render();
  checkWinLose();
});

function render() {
  const state = game.getState();

  cells.forEach((cell, i) => {
    const value = state[Math.floor(i / 4)][i % 4];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = game.getScore();
}

function hideMessages() {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
}

function checkWinLose() {
  const state = game.getState();
  let hasEmpty = false;
  let has2048 = false;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (state[r][c] === 0) {
        hasEmpty = true;
      }

      if (state[r][c] === 2048) {
        has2048 = true;
      }
    }
  }

  if (has2048) {
    game.status = 'win';
    messageWin.classList.remove('hidden');
  } else if (!hasEmpty) {
    game.status = 'lose';
    messageLose.classList.remove('hidden');
  }
}
