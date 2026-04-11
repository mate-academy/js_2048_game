'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

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

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

function render() {
  const state = game.getState();
  const score = game.getScore();
  const globalStatus = game.getStatus();

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

  scoreElement.textContent = score;

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (globalStatus === 'idle') {
    messageStart.classList.remove('hidden');
    startButton.textContent = 'Start';

    startButton.classList.add('start');
    startButton.classList.remove('restart');
  }

  if (globalStatus === 'playing') {
    startButton.textContent = 'Restart';

    startButton.classList.add('restart');
    startButton.classList.remove('start');
  }

  if (globalStatus === 'win') {
    messageWin.classList.remove('hidden');
    startButton.textContent = 'Restart';

    startButton.classList.add('restart');
    startButton.classList.remove('start');
  }

  if (globalStatus === 'lose') {
    messageLose.classList.remove('hidden');
    startButton.textContent = 'Restart';

    startButton.classList.add('restart');
    startButton.classList.remove('start');
  }
}

render();
