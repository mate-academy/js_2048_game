'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const KEYS = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

function render() {
  const state = game.getState().flat();

  cells.forEach((cell, i) => {
    const value = state[i];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    }
  });

  scoreElement.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');

  const isIdle = gameStatus === 'idle';

  button.textContent = isIdle ? 'Start' : 'Restart';
  button.classList.toggle('start', isIdle);
  button.classList.toggle('restart', !isIdle);
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (keyEvent) => {
  const handler = KEYS[keyEvent.key];

  if (!handler) {
    return;
  }

  keyEvent.preventDefault();
  handler();
  render();
});

render();
