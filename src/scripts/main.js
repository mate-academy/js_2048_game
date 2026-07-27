'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  scoreElement.textContent = game.getScore();

  const board = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  const currentStatus = game.getStatus();

  if (currentStatus === 'idle') {
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    startButton.textContent = 'Start';
    startButton.classList.add('start');
    startButton.classList.remove('restart');
  } else if (currentStatus === 'playing') {
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else if (currentStatus === 'win') {
    messageWin.classList.remove('hidden');
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else if (currentStatus === 'lose') {
    messageLose.classList.remove('hidden');
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }
}

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

  render();
});

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

render();
