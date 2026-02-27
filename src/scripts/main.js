'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

const cells = Array.from(document.querySelectorAll('.field-cell'));
const scoreEl = document.querySelector('.game-score');
const button = document.querySelector('.button');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateButton() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    button.classList.add('start');
    button.classList.remove('restart');
    button.textContent = 'Start';
  } else {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }
}

function updateMessages() {
  const gameStatus = game.getStatus();

  if (messageStart) {
    messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  }

  if (messageWin) {
    messageWin.classList.toggle('hidden', gameStatus !== 'win');
  }

  if (messageLose) {
    messageLose.classList.toggle('hidden', gameStatus !== 'lose');
  }
}

function renderBoard() {
  const state = game.getState();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = state[row][col];
      const cell = cells[row * 4 + col];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = String(value);
      }
    }
  }
}

function renderScore() {
  if (scoreEl) {
    scoreEl.textContent = String(game.getScore());
  }
}

function render() {
  renderBoard();
  renderScore();
  updateMessages();
  updateButton();
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
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
      return;
  }

  render();
});

render();
