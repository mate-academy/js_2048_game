'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const rows = document.querySelectorAll('.field-row');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  state.forEach((row, r) => {
    const cells = rows[r].children;

    row.forEach((value, c) => {
      const cell = cells[c];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
    });
  });

  scoreEl.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    messageStart.classList.add('hidden');
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else {
    game.restart();
    messageStart.classList.remove('hidden');
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  }

  render();
});

const keyToMove = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

document.addEventListener('keydown', (keydownEvent) => {
  const move = keyToMove[keydownEvent.key];

  if (!move || game.getStatus() !== 'playing') {
    return;
  }

  keydownEvent.preventDefault();
  move();
  render();
});

render();
