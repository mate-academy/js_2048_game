'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const gameScoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const cells = document.querySelectorAll('.field-cell');

function updateUI() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  gameScoreElement.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageStart.classList.add('hidden');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  updateUI();
});

document.addEventListener('keydown', (keyboardEvent) => {
  if (game.getStatus() === 'idle') {
    return;
  }

  switch (keyboardEvent.key) {
    case 'ArrowLeft':
      keyboardEvent.preventDefault();
      game.moveLeft();
      break;
    case 'ArrowRight':
      keyboardEvent.preventDefault();
      game.moveRight();
      break;
    case 'ArrowUp':
      keyboardEvent.preventDefault();
      game.moveUp();
      break;
    case 'ArrowDown':
      keyboardEvent.preventDefault();
      game.moveDown();
      break;
    default:
      return;
  }

  updateUI();
});
