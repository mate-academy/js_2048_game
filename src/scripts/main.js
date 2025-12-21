'use strict';
import Game from '../modules/Game.class.js';

// Uncomment the next lines to use your game instance in the browser
const game = new Game();

// Write your code here
const button = document.querySelector('button');
const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

document.body.style.overflow = 'hidden';

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.classList.replace('start', 'restart');
    button.textContent = 'Restart';
    messageStart.style.display = 'none';
  } else {
    game.restart();
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  renderBoard(game.getState());
  updateScore(game.getScore());
});

const keyActions = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

document.addEventListener('keydown', (events) => {
  const action = keyActions[events.key];

  if (!action) {
    return;
  }

  action();
  renderBoard(game.getState());
  updateScore(game.getScore());

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }
});

function renderBoard(board) {
  const flatBoard = board.flat();

  cells.forEach((cell, index) => {
    const value = flatBoard[index];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function updateScore(score) {
  scoreEl.textContent = score;
}
