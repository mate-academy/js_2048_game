'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const field = document.querySelector('.game-field');
const btn = document.querySelector('.button.start');
const startMsg = document.querySelector('.message-start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');
const scoreEl = document.querySelector('.game-score');

function render() {
  const state = game.getState();
  const cells = field.querySelectorAll('.field-cell');
  let i = 0;

  state.forEach((row) => {
    row.forEach((val) => {
      const cell = cells[i++];

      cell.className = 'field-cell';

      if (val) {
        cell.textContent = val;
        cell.classList.add(`field-cell--${val}`);
      } else {
        cell.textContent = '';
      }
    });
  });

  scoreEl.textContent = game.getScore();

  const gameStatus = game.getStatus();

  startMsg.classList.toggle('hidden', gameStatus !== 'idle');
  winMsg.classList.toggle('hidden', gameStatus !== 'win');
  loseMsg.classList.toggle('hidden', gameStatus !== 'lose');

  btn.textContent = gameStatus === 'idle' ? 'Start' : 'Restart';
}

btn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  let moved = false;

  if (e.key === 'ArrowLeft') {
    moved = game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    moved = game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    moved = game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    moved = game.moveDown();
  }

  if (moved) {
    render();
  }
});

render();
