'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

// DOM
const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const button = document.querySelector('.button');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

// =======================
// Render
// =======================

function render() {
  const state = game.getState();

  state.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value === 0 ? '' : value;

    // очищаємо старі класи
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = game.getScore();

  updateMessages();
}

function updateMessages() {
  const stat = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (stat === 'idle') {
    messageStart.classList.remove('hidden');
  }

  if (stat === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (stat === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

// =======================
// Controls
// =======================

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
  }

  render();
});

document.addEventListener('keydown', (evt) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (evt.key) {
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
  }

  if (moved) {
    render();
  }
});

// =======================
// Init
// =======================

render();
