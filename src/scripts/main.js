'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
let prevState = game.getState();

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
  const state = game.getState();
  const flat = state.flat();
  const prevFlat = prevState.flat();

  flat.forEach((value, i) => {
    const cell = cells[i];

    // clear previous value classes
    ClearValueClass(cell);
    cell.classList.remove('tile-appear', 'tile-merged', 'tile-move');

    if (value === 0) {
      cell.textContent = '';

      return;
    }

    cell.textContent = String(value);
    cell.classList.add(`field-cell--${value}`);

    if (prevFlat[i] === 0 && value !== 0) {
      const prevIndex = prevFlat.indexOf(value);

      if (prevIndex !== -1) {
        cell.classList.add('tile-move');
      } else {
        cell.classList.add('tile-appear');
      }
    } else if (value > prevFlat[i]) {
      cell.classList.add('tile-merged');
    }

    // remove animation classes after they finish
    setTimeout(() => {
      cell.classList.remove('tile-appear', 'tile-merged', 'tile-move');
    }, 300);
  });

  prevState = state.map((row) => [...row]);
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
