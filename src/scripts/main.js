'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

import Game from '../modules/Game.class.js';

const game = new Game();

const cells = [...document.querySelectorAll('.field-cell')];
const scoreEl = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  cells.forEach((cell, i) => {
    const r = Math.floor(i / 4);
    const c = i % 4;
    const value = state[r][c];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = game.getScore();

  messageStart.classList.toggle('hidden', game.getStatus() !== 'idle');
  messageWin.classList.toggle('hidden', game.getStatus() !== 'win');
  messageLose.classList.toggle('hidden', game.getStatus() !== 'lose');
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
  }
  render();
});

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

render();
