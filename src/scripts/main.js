'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here
const scoreEl = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const fieldRows = document.querySelectorAll('.field-row');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState();

  for (let r = 0; r < 4; r++) {
    const cells = fieldRows[r].querySelectorAll('.field-cell');

    for (let c = 0; c < 4; c++) {
      const value = state[r][c];
      const cell = cells[c];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
    }
  }

  scoreEl.textContent = game.getScore();
}

function updateMessages() {
  const gameStatus = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function updateButton() {
  if (game.getStatus() === 'idle') {
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  } else {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }
}

function render() {
  renderBoard();
  updateMessages();
  updateButton();
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      game.moveLeft();
      break;
    case 'ArrowRight':
      e.preventDefault();
      game.moveRight();
      break;
    case 'ArrowUp':
      e.preventDefault();
      game.moveUp();
      break;
    case 'ArrowDown':
      e.preventDefault();
      game.moveDown();
      break;
    default:
      return;
  }

  render();
});

render();
