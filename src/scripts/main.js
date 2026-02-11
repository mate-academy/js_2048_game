'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState().flat();

  cells.forEach((cell, i) => {
    cell.className = 'field-cell';
    cell.textContent = '';

    if (state[i]) {
      cell.textContent = state[i];
      cell.classList.add(`field-cell--${state[i]}`);
    }
  });

  scoreEl.textContent = game.getScore();

  msgWin.classList.toggle('hidden', game.getStatus() !== 'win');
  msgLose.classList.toggle('hidden', game.getStatus() !== 'lose');
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    msgStart.classList.add('hidden');
  } else {
    game.restart();
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    msgStart.classList.remove('hidden');
  }

  render();
});

document.addEventListener('keydown', (e) => {
  const map = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (map[e.key] && map[e.key]()) {
    if (startButton.textContent === 'Start') {
      startButton.textContent = 'Restart';
      startButton.classList.remove('start');
      startButton.classList.add('restart');
    }

    render();
  }
});
