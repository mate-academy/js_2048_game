'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const scoreEl = document.querySelector('.game-score');
const button = document.querySelector('.button');

const startMsg = document.querySelector('.message-start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');

render();

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    startMsg.classList.add('hidden');
  } else {
    game.restart();
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    startMsg.classList.remove('hidden');
    winMsg.classList.add('hidden');
    loseMsg.classList.add('hidden');
  }

  render();
});

document.addEventListener('keydown', (e) => {
  const keyMap = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (keyMap[e.key]) {
    keyMap[e.key]();
    render();
  }
});

function render() {
  renderField();
  renderScore();
  renderStatus();
}

function renderField() {
  const cells = document.querySelectorAll('.field-cell');
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function renderScore() {
  scoreEl.textContent = game.getScore();
}

function renderStatus() {
  winMsg.classList.add('hidden');
  loseMsg.classList.add('hidden');

  if (game.getStatus() === 'win') {
    winMsg.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMsg.classList.remove('hidden');
  }
}
