'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class.js');

const game = new Game();

const button = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render(state, score, gameStatus) {
  gameScore.textContent = score;

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    }
  });

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');

  if (gameStatus === 'idle') {
    button.classList.add('start');
    button.classList.remove('restart');
    button.textContent = 'start';
  } else {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'restart';
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render(game.getState(), game.getScore(), game.getStatus());
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowRight':
      moved = game.moveRight();
      break;

    case 'ArrowLeft':
      moved = game.moveLeft();
      break;

    case 'ArrowUp':
      moved = game.moveUp();
      break;

    case 'ArrowDown':
      moved = game.moveDown();
      break;
  }

  if (moved || game.getStatus() !== 'playing') {
    render(game.getState(), game.getScore(), game.getStatus());
  }
});
