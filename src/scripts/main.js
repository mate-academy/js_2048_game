'use strict';

import Game from '../modules/Game.class.js';

let startX = 0;
let startY = 0;
const startBtn = document.querySelector('.button.start');
const scoreEl = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

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

document.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  const dx = endX - startX;
  const dy = endY - startY;

  if (game.getStatus() !== 'playing') {
    return;
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) {
      game.moveRight();
    } else if (dx < -30) {
      game.moveLeft();
    }
  } else {
    if (dy > 30) {
      game.moveDown();
    } else if (dy < -30) {
      game.moveUp();
    }
  }

  render();
  updateMessages();
});
