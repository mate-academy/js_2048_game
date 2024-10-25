'use strict';

// import Game from '../modules/Game.class';
const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button.start');

function updateUi() {
  const state = game.getState();
  const gameScore = document.querySelector('.game-score');

  gameScore.textContent = game.getScore();

  document.querySelectorAll('.field-cell').forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }

    cell.textContent = value || '';

    document
      .querySelector('.message-start')
      .classList.toggle('hidden', game.getStatus() !== 'idle');

    document
      .querySelector('.message-lose')
      .classList.toggle('hidden', game.getStatus() !== 'loss');

    document
      .querySelector('.message-win')
      .classList.toggle('hidden', game.getStatus() !== 'win');
  });

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
  }

  updateUi();
});

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  updateUi();
});

updateUi();
