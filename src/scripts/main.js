'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const mainButton = document.getElementById('mainButton');
const scoreEl = document.getElementById('score');
const startMessage = document.getElementById('startMessage');
const winMessage = document.getElementById('winMessage');
const gameOverMessage = document.getElementById('gameOverMessage');
const boardEl = document.getElementById('board');
const cells = Array.from(boardEl.querySelectorAll('.cell'));

function render() {
  const state = game.getState();

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const idx = r * 4 + c;
      const el = cells[idx];
      const val = state[r][c];

      el.className = 'cell';

      if (val) {
        el.textContent = val;
        el.classList.add(`field-cell--${val}`);
      } else {
        el.textContent = '';
      }
    }
  }

  scoreEl.textContent = game.getScore();

  const st = game.getStatus();

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  gameOverMessage.classList.add('hidden');

  if (st === 'start') {
    startMessage.classList.remove('hidden');
  } else if (st === 'win') {
    winMessage.classList.remove('hidden');
  } else if (st === 'lose') {
    gameOverMessage.classList.remove('hidden');
  }

  if (st !== 'start') {
    mainButton.textContent = 'Restart';
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
  } else {
    mainButton.textContent = 'Start';
    mainButton.classList.remove('restart');
    mainButton.classList.add('start');
  }
}

mainButton.addEventListener('click', () => {
  if (game.getStatus() === 'start') {
    game.start();
  } else {
    game.restart();
  }
  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      return;
  }

  render();
});

render();
