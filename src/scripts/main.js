'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const cells = document.querySelectorAll('.field-cell');

function renderBoard() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;

    const value = state[row][col];

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });

  score.textContent = game.getScore();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    startMessage.classList.add('hidden');

    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();

    startMessage.classList.remove('hidden');

    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
  }

  renderBoard();
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

  renderBoard();
});

renderBoard();
