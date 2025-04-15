'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
import Game from '../modules/Game.class.js';

const game = new Game();

function render() {
  const state = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
  });

  document.querySelector('.game-score').textContent = game.getScore();

  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
  } else {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    render();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    render();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    render();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    render();
  }
});

const button = document.querySelector('.start');

button.addEventListener('click', () => {
  game.restart();
  render();

  // zmień napis
  button.textContent = 'Restart';

  button.classList.remove('start');
  button.classList.add('restart');

  // ukryj komunikaty
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-start')?.classList.add('hidden');
});
