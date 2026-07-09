'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const restartButton = document.querySelector('.button.restart');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

const cells = document.querySelectorAll('.field-cell');

function render() {
  const state = game.getState();

  scoreElement.textContent = game.getScore();

  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[i].length; j++) {
      const index = i * 4 + j;
      const cell = cells[index];

      if (state[i][j] === 0) {
        cell.textContent = '';
        cell.className = 'field-cell';
      } else {
        cell.textContent = state[i][j];
        cell.className = `field-cell field-cell--${state[i][j]} field-cell--new`;
      }
    }
  }

  updateMessages();
}

startButton.addEventListener('click', () => {
  game.start();

  startMessage.classList.add('hidden');

  render();
});

restartButton.addEventListener('click', () => {
  game.restart();

  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  startMessage.classList.remove('hidden');

  render();
});

document.addEventListener('keydown', (e) => {
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
      return;
  }

  render();
});

function updateMessages() {
  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}
