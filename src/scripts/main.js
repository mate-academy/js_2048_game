'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function updateBoard() {
  const state = game.getState().flat();

  cells.forEach((cell, index) => {
    const value = state[index];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    }
  });
}

function updateScore() {
  scoreElement.textContent = game.getScore();
}

function updateMessages() {
  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (status === 'idle') {
    startMessage.classList.remove('hidden');
  }

  if (status === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (status === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

function render() {
  updateBoard();
  updateScore();
  updateMessages();
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();
    game.start();

    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }

  render();
});

// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
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
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
    render();
  }
});

render();
