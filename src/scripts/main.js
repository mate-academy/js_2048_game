/* eslint-disable no-shadow */
'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

// --- DOM references ---
const scoreEl = document.querySelector('.game-score');
const btnEl = document.querySelector('.button');
const cellEls = document.querySelectorAll('.field-cell');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

// --- Render helpers ---

function cellClass(value) {
  if (!value) {
    return '';
  }

  const knownValues = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

  if (knownValues.includes(value)) {
    return `field-cell--${value}`;
  }

  return 'field-cell--2048'; // fallback for values beyond 2048
}

function render() {
  const state = game.getState();

  // Update board cells (row-major order matches the flat NodeList)
  cellEls.forEach((td, i) => {
    const r = Math.floor(i / 4);
    const c = i % 4;
    const value = state[r][c];

    // Remove any previous value class
    td.className = 'field-cell';

    if (value) {
      td.classList.add(cellClass(value));
      td.textContent = value;
    } else {
      td.textContent = '';
    }
  });

  // Update score
  scoreEl.textContent = game.getScore();

  // Update messages
  const status = game.getStatus();

  msgStart.classList.toggle('hidden', status !== 'idle');
  msgWin.classList.toggle('hidden', status !== 'win');
  msgLose.classList.toggle('hidden', status !== 'lose');

  // Update button label & style
  if (status === 'idle') {
    btnEl.className = 'button start';
    btnEl.textContent = 'Start';
  } else {
    btnEl.className = 'button restart';
    btnEl.textContent = 'Restart';
  }
}

// --- Button handler ---

btnEl.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  render();
});

// --- Keyboard handler ---

document.addEventListener('keydown', (event) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const keyMap = {
    ArrowLeft: 'moveLeft',
    ArrowRight: 'moveRight',
    ArrowUp: 'moveUp',
    ArrowDown: 'moveDown',
  };

  const method = keyMap[event.key];

  if (!method) {
    return;
  }

  event.preventDefault(); // prevent page scroll on arrow keys

  game[method]();
  render();
});

// --- Initial render ---
render();
