'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreDisplay = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

startButton.addEventListener('click', () => {
  game.start();
  render();
  hideMessages();
  startButton.textContent = 'Restart';
  startButton.classList.add('restart');
});

const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

document.addEventListener('keydown', (e) => {
  if (!arrowKeys.includes(e.key)) {
    return;
  }

  const prevState = JSON.stringify(game.getState());

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
  }

  const newState = JSON.stringify(game.getState());

  if (prevState !== newState) {
    render();
  }
});

function render() {
  const state = game.getState(); // [[0, 2, 0, 4], [...], ...]

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreDisplay.textContent = game.getScore();

  if (game.checkWin()) {
    messageWin.classList.remove('hidden');
  } else if (game.checkLose()) {
    messageLose.classList.remove('hidden');
  }
}

function hideMessages() {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
}
