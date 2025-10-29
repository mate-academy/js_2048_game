'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

let hasMoved = false;

const cells = Array.from(document.querySelectorAll('.field-cell'));
const scoreEl = document.querySelector('.game-score');
const btn = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  scoreEl.textContent = score;

  let i = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = state[r][c];
      const cell = cells[i++];

      cell.className = 'field-cell';
      cell.textContent = val || '';

      if (val) {
        cell.classList.add(`field-cell--${val}`);
      }
    }
  }

  msgStart.classList.toggle('hidden', gameStatus !== 'start');
  msgWin.classList.toggle('hidden', gameStatus !== 'won');
  msgLose.classList.toggle('hidden', gameStatus !== 'over');

  if (!hasMoved) {
    btn.textContent = 'Start';
    btn.classList.add('start');
    btn.classList.remove('restart');
  } else {
    btn.textContent = 'Restart';
    btn.classList.remove('start');
    btn.classList.add('restart');
  }
}

btn.addEventListener('click', () => {
  if (!hasMoved) {
    game.start();
  } else {
    game.restart();
    hasMoved = false;
  }
  render();
});

msgLose.addEventListener('click', () => {
  if (game.getStatus() === 'over') {
    game.restart();
    hasMoved = false;
    render();
  }
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
    hasMoved = true;
    render();
  }
});

render();
