'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const button = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState().flat();

  cells.forEach((cell, i) => {
    const value = state[i];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = game.getScore();

  updateMessages();
}

function updateMessages() {
  const gameStatus = game.getStatus();

  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

  if (gameStatus === 'idle') {
    msgStart.classList.remove('hidden');
  }

  if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
  }
}

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

document.addEventListener('keydown', (e) => {
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
  }

  if (moved) {
    render();
  }
});

render();
