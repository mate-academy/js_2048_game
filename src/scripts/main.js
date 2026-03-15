'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;

    const value = state[row][col];

    if (value === 0) {
      cell.textContent = '';
    } else {
      cell.textContent = value;
    }

    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function renderScore() {
  score.textContent = game.getScore();
}

function renderStatus() {
  const gameStatus = game.getStatus();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
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
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');

    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
  }

  renderBoard();
  renderScore();
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
  renderScore();
  renderStatus();
});
