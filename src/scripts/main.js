/* eslint-disable no-shadow */
'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const size = 4;

const field = document.querySelector('tbody');
const scoreEl = document.querySelector('.game-score');
const statusEl = document.querySelector('.message-container');
const button = document.querySelector('.start');

const game = new Game();

function renderBoard() {
  const state = game.getState();

  field.innerHTML = '';

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
    field.appendChild(rowEl);
  }

  scoreEl.textContent = game.getScore();

  const status = game.getStatus();

  statusEl.textContent =
    status === 'win' ? 'You win!' : status === 'lose' ? 'Game over' : '';
  statusEl.classList.toggle('hidden', status === 'playing');
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

document.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    handleMove(event.key);
  }
});

let started = false;

button.addEventListener('click', () => {
  if (!started) {
    game.start();
    started = true;
  } else {
    game.restart();
  }

  renderBoard();

  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
});

