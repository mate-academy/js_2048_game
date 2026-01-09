'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const scoreEl = document.querySelector('.game-score');
const buttonEl = document.querySelector('.button.start');
const cells = document.querySelectorAll('.field-cell');

const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function hideAllMessages() {
  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');
}

function showMessageByStatus() {
  hideAllMessages();

  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    msgStart.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
  }
}

function render() {
  const state = game.getState();

  scoreEl.textContent = String(game.getScore());

  let i = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = state[r][c];
      const cell = cells[i];

      cell.textContent = value === 0 ? '' : String(value);

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }

      i++;
    }
  }

  showMessageByStatus();

  if (game.getStatus() !== 'idle') {
    buttonEl.textContent = 'Restart';
    buttonEl.classList.remove('start');
    buttonEl.classList.add('restart');
  } else {
    buttonEl.textContent = 'Start';
    buttonEl.classList.remove('restart');
    buttonEl.classList.add('start');
  }
}

buttonEl.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
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
