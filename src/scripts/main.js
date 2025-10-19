'use strict';

import { Game } from '../modules/Game.class.js';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

// --- Функція оновлення UI ---
function updateUI() {
  const state = game.getState();

  cells.forEach((cell, idx) => {
    const row = Math.floor(idx / 4);
    const col = idx % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell'; // очищає класи

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = game.getScore();

  messageWin.classList.toggle('hidden', game.getStatus() !== 'won');
  messageLose.classList.toggle('hidden', game.getStatus() !== 'lost');
  messageStart.classList.add('hidden');
}

// --- Обробка рухів ---
function handleMove(moveFn) {
  if (game.getStatus() === 'playing' && moveFn()) {
    updateUI();
    startBtn.textContent = 'Restart';
    startBtn.classList.add('restart');
    startBtn.classList.remove('start');
  }
}

// --- Start / Restart кнопка ---
startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'notStarted') {
    game.start();
  } else {
    game.restart();
  }

  updateUI();
  startBtn.textContent = 'Restart';
  startBtn.classList.add('restart');
  startBtn.classList.remove('start');
});

// --- Клавіші стрілок ---
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      handleMove(() => game.moveLeft());
      break;
    case 'ArrowRight':
      handleMove(() => game.moveRight());
      break;
    case 'ArrowUp':
      handleMove(() => game.moveUp());
      break;
    case 'ArrowDown':
      handleMove(() => game.moveDown());
      break;
  }
});

document.addEventListener('contextmenu', (e) => e.preventDefault());
