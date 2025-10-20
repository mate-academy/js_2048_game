'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const cells = Array.from(document.querySelectorAll('.field-cell'));
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

function render() {
  const state = game.getState();
  let idx = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = state[r][c];
      const el = cells[idx];

      el.className = 'field-cell';

      if (val !== 0) {
        el.textContent = val;
        el.classList.add(`field-cell--${val}`);
      } else {
        el.textContent = '';
      }
      idx++;
    }
  }

  scoreEl.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');

  startBtn.className = 'button';

  if (gameStatus === 'not_started') {
    startBtn.textContent = 'Start';
    startBtn.classList.add('start');
    messageStart.classList.remove('hidden');
  } else if (gameStatus === 'playing') {
    startBtn.textContent = 'Restart';
    startBtn.classList.add('restart');
  } else if (gameStatus === 'won') {
    startBtn.textContent = 'Restart';
    startBtn.classList.add('restart');
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'over') {
    startBtn.textContent = 'Restart';
    startBtn.classList.add('restart');
    messageLose.classList.remove('hidden');
  }
}

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

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'not_started') {
    game.start();
  } else {
    game.restart();
  }
  render();
});

render();
