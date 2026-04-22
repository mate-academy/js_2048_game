'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const bestScoreEl = document.querySelector('.best-score');
const button = document.querySelector('.start');

function getBest() {
  return Number(localStorage.getItem('bestScore')) || 0;
}

function setBest(value) {
  localStorage.setItem('bestScore', value);
}

function render(prevState = null) {
  const state = game.getState();

  score.textContent = game.getScore();

  bestScoreEl.textContent = getBest();

  cells.forEach((cell, index) => {
    const r = Math.floor(index / 4);
    const c = index % 4;

    const value = state[r][c];
    const prevValue = prevState?.[r]?.[c] ?? 0;

    cell.textContent = value || '';
    cell.className = 'field-cell';
    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }

    if (prevValue === 0 && value) {
      cell.classList.add('new');
    }

    if (value && value === prevValue * 2) {
      cell.classList.add('merge');
    }

    setTimeout(() => {
      cell.classList.remove('new', 'merge');
    }, 200);
  });

  updateMessage();
}

function updateMessage() {
  const status = game.getStatus();

  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');

  if (status === 'idle') {
    document.querySelector('.message-start').classList.remove('hidden');
  }

  if (status === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  }

  if (status === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }

  if (status !== 'idle') {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }
}

function handleMove(fn) {
  const prev = game.getState();
  fn();
  render(prev);
  updateBest();
}

function updateBest() {
  const best = getBest();
  const current = game.getScore();

  if (current > best) {
    setBest(current);
    bestScoreEl.textContent = current;
  }
}

/* START / RESTART */
button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
  updateBest();
});

/* KEYBOARD */
document.addEventListener('keydown', (e) => {
  const actions = {
    ArrowLeft: () => handleMove(() => game.moveLeft()),
    ArrowRight: () => handleMove(() => game.moveRight()),
    ArrowUp: () => handleMove(() => game.moveUp()),
    ArrowDown: () => handleMove(() => game.moveDown()),
  };

  if (actions[e.key]) actions[e.key]();
});

/* INITIAL */
render();
bestScoreEl.textContent = getBest();