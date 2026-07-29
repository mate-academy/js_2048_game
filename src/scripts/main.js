'use strict';

import Game from '../modules/Game.class';

const size = 4;

const gameField = document.querySelector('tbody');
const score = document.querySelector('.game-score');
const statusEl = document.querySelector('.message-container');
const button = document.querySelector('.start');

const game = new Game();

function renderBoard() {
  const state = game.getState();

  gameField.innerHTML = '';

  for (let row = 0; row < size; row++) {
    const rowEl = document.createElement('tr');

    for (let col = 0; col < size; col++) {
      const cell = document.createElement('td');
      const value = state[row][col];

      cell.classList.add('field-cell');

      if (value) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
      rowEl.appendChild(cell);
    }
    gameField.appendChild(rowEl);
  }

  score.textContent = game.getScore();

  const statusS = game.getStatus();

  statusEl.querySelector('.message-start').classList.toggle('hidden', started);

  statusEl
    .querySelector('.message-win')
    .classList.toggle('hidden', statusS !== 'win');

  statusEl
    .querySelector('.message-lose')
    .classList.toggle('hidden', statusS !== 'lose');

  if (statusS === 'win' || statusS === 'lose') {
    renderBoard();
  }

  statusEl.classList.toggle('hidden', statusS !== 'playing');
}

function handleMove(direction) {
  if (game.getStatus() !== 'playing' || !started) {
    return;
  }

  const moved = {
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
  }[direction];

  if (moved) {
    moved();
    renderBoard();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }
}

document.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    handleMove(e.key);
  }
});

let started = false;

button.addEventListener('click', () => {
  if (!started) {
    game.start();
    started = true;

    statusEl.querySelector('.message-start').classList.add('hidden');
  } else {
    game.restart();
    started = true;
  }

  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';

  renderBoard();
});
