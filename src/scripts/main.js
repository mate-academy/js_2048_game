'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const buttonElement = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();
  let cellIndex = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = state[r][c];
      const cell = cells[cellIndex];

      cellIndex++;

      cell.className = 'field-cell';

      if (value > 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
      }
    }
  }

  scoreElement.textContent = game.getScore();

  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');

    buttonElement.textContent = 'Start';
    buttonElement.classList.remove('restart');
    buttonElement.classList.add('start');
  } else {
    messageStart.classList.add('hidden');
    buttonElement.textContent = 'Restart';
    buttonElement.classList.remove('start');
    buttonElement.classList.add('restart');

    if (gameStatus === 'win') {
      messageWin.classList.remove('hidden');
      messageLose.classList.add('hidden');
    } else if (gameStatus === 'lose') {
      messageLose.classList.remove('hidden');
      messageWin.classList.add('hidden');
    } else {
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');
    }
  }
}

buttonElement.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  render();
});

document.addEventListener('keydown', (e) => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'win' || gameStatus === 'lose') {
    return;
  }

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
    e.preventDefault();
    render();
  }
});

render();
