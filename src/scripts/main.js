'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();
  updateStatus();
}

function updateStatus() {
  const gameStatus = game.getStatus();

  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function handleMove(key) {
  const actions = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  const move = actions[key];

  if (!move) {
    return;
  }

  const moved = move();

  if (moved) {
    render();

    if (!button.classList.contains('restart')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
    }
  }
}

document.addEventListener('keydown', (e) => {
  handleMove(e.key);
});

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    messageStart.classList.remove('hidden');
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  }

  render();
});
