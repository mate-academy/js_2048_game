'use strict';

const Game = require('./modules/Game.class');

const game = new Game();

/* ===== DOM ===== */

const field = document.querySelector('.game-field');
const scoreEl = document.querySelector('.game-score');
const statusEl = document.querySelector('.game-status');
const startBtn = document.querySelector('.start');

/* ===== RENDER ===== */

function render() {
  const state = game.getState();
  const score = game.getScore();
  const status = game.getStatus();

  field.innerHTML = '';

  state.flat().forEach(value => {
    const cell = document.createElement('div');
    cell.classList.add('field-cell');

    if (value) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }

    field.appendChild(cell);
  });

  scoreEl.textContent = score;

  statusEl.textContent = '';
  if (status === 'win') {
    statusEl.textContent = 'You win!';
  }

  if (status === 'lose') {
    statusEl.textContent = 'Game over!';
  }
}

/* ===== GAME CONTROLS ===== */

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startBtn.textContent = 'Restart';
  } else {
    game.restart();
    startBtn.textContent = 'Start';
  }

  render();
});

document.addEventListener('keydown', e => {
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
    default:
      return;
  }

  if (moved) {
    render();
  }
});

/* ===== INITIAL RENDER ===== */

render();


