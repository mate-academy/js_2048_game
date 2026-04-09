'use strict';

const Game = require('../modules/Game.class');

const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = Array.from(document.querySelectorAll('.field-cell'));

const game = new Game();

function updateBoard() {
  const state = game.getState();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = cells[i * 4 + j];
      const value = state[i][j];

      cell.textContent = value === 0 ? '' : value;

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  scoreElement.textContent = game.getScore();

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

function handleMove(moveFn) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const changed = moveFn.call(game);

  if (changed) {
    updateBoard();
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    messageStart.classList.add('hidden');

    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();
    messageStart.classList.remove('hidden');

    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  }

  updateBoard();
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      handleMove(game.moveLeft);
      break;
    case 'ArrowRight':
      handleMove(game.moveRight);
      break;
    case 'ArrowUp':
      handleMove(game.moveUp);
      break;
    case 'ArrowDown':
      handleMove(game.moveDown);
      break;
    default:
      break;
  }
});
