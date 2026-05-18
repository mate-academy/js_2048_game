'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');

const startButton = document.querySelector('.button');

const scoreElement = document.querySelector('.game-score');

const startMessage = document.querySelector('.message-start');

const winMessage = document.querySelector('.message-win');

const loseMessage = document.querySelector('.message-lose');

let hasStarted = true;

function renderBoard() {
  const state = game.getState().flat();

  cells.forEach((cell, index) => {
    const value = state[index];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value !== 0) {
      cell.textContent = value;

      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  game.restart();

  startMessage.classList.add('hidden');

  hasStarted = false;

  renderBoard();
});

document.addEventListener('keydown', (e) => {
  if (
    game.getStatus() === 'idle' ||
    game.getStatus() === 'win' ||
    game.getStatus() === 'lose'
  ) {
    return;
  }

  const oldState = JSON.stringify(game.getState());

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

  const newState = JSON.stringify(game.getState());

  // button changes after FIRST MOVE
  if (!hasStarted && oldState !== newState) {
    startButton.textContent = 'Restart';

    startButton.classList.remove('start');

    startButton.classList.add('restart');

    hasStarted = true;
  }

  renderBoard();
});

renderBoard();
