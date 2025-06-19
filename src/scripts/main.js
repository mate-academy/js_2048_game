'use strict';

import Game from '../modules/Game.class.js';

const startBtn = document.querySelector('.button.start');
const scoreEl = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const touchButtons = document.querySelectorAll('.btn-move');

const game = new Game();

function updateMessages() {
  const gameStatus = game.getStatus();

  document
    .querySelector('.message-win')
    .classList.toggle('hidden', gameStatus !== 'win');

  document
    .querySelector('.message-lose')
    .classList.toggle('hidden', gameStatus !== 'lose');
}

function render() {
  scoreEl.textContent = game.getScore();

  const state = game.getState();

  cells.forEach((cell, index) => {
    const value = state[Math.floor(index / 4)][index % 4];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  startBtn.textContent = 'Restart';

  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
}

startBtn.addEventListener('click', () => {
  startBtn.classList.add('restart');

  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const keyMap = {
    ArrowLeft: 'moveLeft',
    ArrowRight: 'moveRight',
    ArrowUp: 'moveUp',
    ArrowDown: 'moveDown',
  };

  const move = keyMap[e.key];

  if (move) {
    game[move]();
    render();
    updateMessages();
  }
});

touchButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    const move = btn.dataset.move;

    if (move) {
      game[move]();
      render();
      updateMessages();
    }
  });
});
