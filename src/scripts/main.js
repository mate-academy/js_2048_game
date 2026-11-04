'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  cells.forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = state[row][col];

    cell.className = 'field-cell';
    cell.textContent = value || '';

    if (value) {
      cell.classList.add(`field-cell-${value}`);
    }
  });

  scoreEl.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');

  if (gameStatus === 'idle') {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  } else {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }
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
  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (!moves[keyEvent.key]) {
    return;
  }

  keyEvent.preventDefault();
  moves[keyEvent.key]();
  render();
});

render();
