'use strict';

import Game from '../modules/Game.class.js';
// const Game = require('../modules/Game.class');

const game = new Game();

render();
updateUI();

const cells = Array.from(document.querySelectorAll('.field-cell'));

function render() {
  const state = game.getState();

  if (!Array.isArray(state) || state.length === 0) {
    return;
  }

  for (let row = 0; row < state.length; row++) {
    for (let col = 0; col < state[row].length; col++) {
      const idx = row * state.length + col;

      if (idx >= cells.length) {
        continue;
      }

      const cell = cells[idx];
      const value = state[row][col];

      cell.textContent = value || '';

      const baseClass = 'field-cell';

      cell.className = baseClass;

      if (value) {
        cell.classList.add(`${baseClass}--${value}`);
      }
    }
  }

  const score = document.querySelector('.game-score');

  score.textContent = game.getScore();
}

const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');
const msgButton = document.querySelector('.start');

function updateUI() {
  const gameStatus = game.getStatus();

  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

  switch (gameStatus) {
    case 'idle':
      msgStart.classList.remove('hidden');
      msgButton.textContent = 'Start';
      msgButton.classList.remove('restart');
      msgButton.classList.add('start');
      break;
    case 'playing':
      msgButton.textContent = 'Restart';
      msgButton.classList.remove('start');
      msgButton.classList.add('restart');
      break;
    case 'win':
      msgWin.classList.remove('hidden');
      break;
    case 'lose':
      msgLose.classList.remove('hidden');
      break;
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  function handleMove(fn) {
    const moved = fn();

    if (moved) {
      render();
      updateUI();
    }
  }

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

msgButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    render();
    updateUI();
  } else {
    game.restart();
    render();
    updateUI();
  }
});
