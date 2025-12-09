'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

const cells = Array.from(document.querySelectorAll('.field-cell'));
const btStart = document.querySelector('.button');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

document.addEventListener('keydown', (e) => {
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

btStart.addEventListener('click', () => {
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  if (game.getStatus() === 'idle') {
    btStart.classList.remove('start');
    btStart.classList.add('restart');
    btStart.textContent = 'Restart';
    game.start();
  } else {
    btStart.classList.remove('restart');
    btStart.classList.add('start');
    btStart.textContent = 'Start';
    game.restart();
  }
  render();
});

function render() {
  const state = game.getState();

  cells.forEach((cell, i) => {
    const r = Math.floor(i / 4);
    const c = i % 4;
    const value = state[r][c];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }

    score.textContent = game.getScore();

    if (game.getStatus() === 'win') {
      messageWin.classList.remove('hidden');
    }

    if (game.getStatus() === 'lose') {
      messageLose.classList.remove('hidden');
    }
  });
}
