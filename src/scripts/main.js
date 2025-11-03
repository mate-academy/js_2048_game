'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

import Game from '../modules/Game.class.js';

const game = new Game();

const cells = Array.from(document.querySelectorAll('.field-cell'));
const scoreEl = document.querySelector('.game-score');
const btn = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

const cellIndex = (r, c) => r * 4 + c;

function render() {
  const state = game.getState();

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const i = cellIndex(r, c);
      const el = cells[i];
      const val = state[r][c];

      el.textContent = val === 0 ? '' : String(val);
      el.className = 'field-cell';

      if (val) {
        el.classList.add(`field-cell--${val}`);
      }
    }
  }

  scoreEl.textContent = String(game.getScore());

  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    msgStart.classList.remove('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
    btn.textContent = 'Start';
    btn.classList.add('start');
    btn.classList.remove('restart');
  } else {
    msgStart.classList.add('hidden');
    btn.textContent = 'Restart';
    btn.classList.remove('start');
    btn.classList.add('restart');
  }

  if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
  } else {
    msgWin.classList.add('hidden');
  }

  if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
  } else {
    msgLose.classList.add('hidden');
  }
}

function ensurePlaying() {
  if (game.getStatus() === 'idle') {
    game.start();
  }
}

btn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
    return;
  }

  ensurePlaying();

  let moved = false;

  if (key === 'ArrowLeft') {
    moved = game.moveLeft();
  } else if (key === 'ArrowRight') {
    moved = game.moveRight();
  } else if (key === 'ArrowUp') {
    moved = game.moveUp();
  } else if (key === 'ArrowDown') {
    moved = game.moveDown();
  }

  if (moved) {
    render();
  }
});

render();
