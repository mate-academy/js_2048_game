'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

// Creating DOM elements
const startRestart = document.querySelector('button');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

startRestart.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    startRestart.textContent = 'Restart';
    startRestart.classList.remove('start');
    startRestart.classList.add('restart');
  } else {
    game.restart();

    startRestart.textContent = 'Start';
    startRestart.classList.remove('restart');
    startRestart.classList.add('start');
  }

  updateUI();
});

document.addEventListener('keydown', (e) => {
  startRestart.blur();

  const keys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'];

  if (keys.includes(e.key)) {
    e.preventDefault();
  }

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
      return null;
  }

  game.checkWin();
  game.checkLose();

  updateUI();
});

function renderBoard(board) {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell) => {
    cell.textContent = '';
    cell.className = 'field-cell';
  });

  board.flat().forEach((value, i) => {
    if (value !== 0) {
      const cell = cells[i];

      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function updateUI() {
  renderBoard(game.getState());

  scoreElement.textContent = game.getScore();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (game.status === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.status === 'lose') {
    messageLose.classList.remove('hidden');
  }
}
