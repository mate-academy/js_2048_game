'use strict';

import Game from '../modules/Game.class.js';

const gameScoreElement = document.querySelector('.game-score');

const cells = document.querySelectorAll('.field-cell');
const btnControl = document.querySelector('.button');

const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

const game = new Game();

function updateUI() {
  const board = game.getState().flat();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  cells.forEach((cell, index) => {
    const value = board[index];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  gameScoreElement.textContent = score;

  msgWin.classList.toggle('hidden', gameStatus !== 'win');
  msgLose.classList.toggle('hidden', gameStatus !== 'lose');

  if (gameStatus !== 'idle') {
    msgStart.classList.add('hidden');
  }
}

btnControl.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();

    btnControl.textContent = 'Start';
    btnControl.classList.add('start');
    btnControl.classList.remove('restart');
  }
  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (event.key) {
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
    if (btnControl.classList.contains('start')) {
      btnControl.textContent = 'Restart';
      btnControl.classList.remove('start');
      btnControl.classList.add('restart');
    }
    updateUI();
  }
});
