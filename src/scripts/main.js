'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');

const msgLose = document.querySelector('.message-lose');
const msgWin = document.querySelector('.message-win');
const msgStart = document.querySelector('.message-start');

const cells = Array.from(document.querySelectorAll('.field-cell'));

function renderScore() {
  scoreEl.textContent = String(game.getScore());
}

function renderMessage() {
  const gameStatus = game.getStatus();

  // start message
  if (gameStatus === 'idle') {
    msgStart.classList.remove('hidden');
  } else {
    msgStart.classList.add('hidden');
  }

  msgWin.classList.toggle('hidden', gameStatus !== 'win');
  msgLose.classList.toggle('hidden', gameStatus !== 'lose');
}

function ClearValueClass(cell) {
  const classesToRemove = [];

  cell.classList.forEach((cls) => {
    if (cls.startsWith('field-cell--')) {
      classesToRemove.push(cls);
    }
  });

  classesToRemove.forEach((cls) => {
    cell.classList.remove(cls);
  });
}

function renderBoard() {
  const flat = game.getState().flat();

  flat.forEach((value, i) => {
    const cell = cells[i];

    ClearValueClass(cell);

    if (value === 0) {
      cell.textContent = '';
    } else {
      cell.textContent = String(value);
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function render() {
  renderScore();
  renderMessage();
  renderBoard();
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
  } else {
    game.restart();
    button.textContent = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');
  }

  render();
});

document.addEventListener('keydown', (GameEvent) => {
  if (game.getStatus() === 'idle') {
    return;
  }

  switch (GameEvent.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      return;
  }

  button.textContent = 'Restart';
  button.classList.add('restart');
  button.classList.remove('start');

  render();
});

render();
