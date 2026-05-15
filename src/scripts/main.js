'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');

function renderBoard() {
  const state = game.getState();

  cells.forEach((cell, i) => {
    const r = Math.floor(i / 4);
    const c = i % 4;
    const val = state[r][c];

    // Remove old value classes
    cell.className = 'field-cell';

    if (val !== 0) {
      cell.classList.add(`field-cell--${val}`);
      cell.textContent = val;
    } else {
      cell.textContent = '';
    }
  });

  scoreEl.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}

button.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
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
