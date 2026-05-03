'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

function render() {
  const state = game.getState();

  const gameScore = document.querySelector('.game-score');

  gameScore.textContent = game.getScore();

  const cells = document.querySelectorAll('.field-cell');

  for (let index = 0; index < cells.length; index++) {
    const i = Math.floor(index / 4);
    const j = index % 4;

    const value = state[i][j];
    const cell = cells[index];

    cell.textContent = '';
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  }

  const gameStatus = game.getStatus();

  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  }

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  let moved = false;

  if (e.key === 'ArrowLeft') {
    moved = game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    moved = game.moveRight();
  } else if (e.key === 'ArrowUp') {
    moved = game.moveUp();
  } else if (e.key === 'ArrowDown') {
    moved = game.moveDown();
  }

  if (moved) {
    render();
  }
});

const startBtn = document.querySelector('.start');

startBtn.addEventListener('click', () => {
  if (startBtn.classList.contains('start')) {
    game.start();
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  } else {
    game.restart();
  }

  render();
});
