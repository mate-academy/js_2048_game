'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function render() {
  const board = game.getState();
  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  startMessage.classList.toggle('hidden', status !== 'idle');
  winMessage.classList.toggle('hidden', status !== 'win');
  loseMessage.classList.toggle('hidden', status !== 'lose');

  startButton.textContent = status === 'idle' ? 'Start' : 'Restart';
  startButton.classList.toggle('start', status === 'idle');
  startButton.classList.toggle('restart', status !== 'idle');
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (keyboardEvent) => {
  const arrowKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (!arrowKeys.includes(keyboardEvent.key)) {
    return;
  }

  keyboardEvent.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (keyboardEvent.key) {
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

  render();
});

render();
