'use strict';

import Game from '../modules/Game.class.js';

const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const buttonEl = document.querySelector('.button');
const msgStartEl = document.querySelector('.message-start');
const msgWinEl = document.querySelector('.message-win');
const msgLoseEl = document.querySelector('.message-lose');

const game = new Game();
let isMoving = false;
let firstMoveDone = false;

function renderBoard() {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  for (let i = 0; i < cells.length; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const cell = cells[i];
    const value = state[row][col];

    [...cell.classList].forEach((className) => {
      if (className.startsWith('field-cell--')) {
        cell.classList.remove(className);
      }
    });

    if (value === 0) {
      cell.textContent = '';
    } else {
      cell.textContent = String(value);
      cell.classList.add(`field-cell--${value}`);
    }
  }

  scoreEl.textContent = score;
  msgStartEl.classList.add('hidden');
  msgWinEl.classList.add('hidden');
  msgLoseEl.classList.add('hidden');

  if (gameStatus === 'idle') {
    msgStartEl.classList.remove('hidden');
  }

  if (gameStatus === 'win') {
    msgWinEl.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    msgLoseEl.classList.remove('hidden');
  }
}

renderBoard();

buttonEl.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  renderBoard();
});

document.addEventListener('keydown', (e) => {
  if (
    e.key !== 'ArrowLeft' &&
    e.key !== 'ArrowRight' &&
    e.key !== 'ArrowUp' &&
    e.key !== 'ArrowDown'
  ) {
    return;
  }
  e.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  if (isMoving || e.repeat) {
    return;
  }
  isMoving = true;

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
    renderBoard();

    if (!firstMoveDone) {
      buttonEl.classList.remove('start');
      buttonEl.classList.add('restart');
      buttonEl.textContent = 'Restart';
      firstMoveDone = true;
    }
  }
  isMoving = false;
});
