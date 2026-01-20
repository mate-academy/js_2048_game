'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

// Інтерфейс
const cells = document.querySelectorAll('.field-cell');
const scoreLabel = document.querySelector('.game-score');
const button = document.querySelector('.button');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

// ---------------------------
//  UI
// ---------------------------
function updateView() {
  const state = game.getState();
  let index = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = cells[index];
      const value = state[r][c];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
      }

      index++;
    }
  }

  scoreLabel.textContent = game.getScore();
  updateStatusView();
}

function updateStatusView() {
  const gameStatus = game.getStatus();

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (gameStatus === 'idle') {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    startMessage.classList.remove('hidden');
  }

  if (gameStatus === 'playing') {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

// ---------------------------
//  Start / Restart
// ---------------------------
button.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  updateView();
});

// ---------------------------
// Управління стрілками
// ---------------------------
document.addEventListener('keydown', (e) => {
  const gameStatus = game.getStatus();

  if (gameStatus !== 'playing') {
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
      return; // не блокуємо інші клавіші
  }

  if (moved) {
    updateView();
  }
});

// Початковий рендер
updateView();
