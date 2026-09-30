'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function render() {
  const state = game.getState();

  cells.forEach((cell, i) => {
    const value = state[Math.floor(i / 4)][i % 4];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    }
  });

  scoreEl.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');

  if (gameStatus === 'idle') {
    button.textContent = 'Start';
    button.className = 'button start';
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

document.addEventListener('keydown', (e) => {
  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (!moves[e.key] || game.getStatus() !== 'playing') {
    return;
  }

  e.preventDefault();

  const stateBefore = game.getScore() + JSON.stringify(game.getState());

  moves[e.key]();

  const stateAfter = game.getScore() + JSON.stringify(game.getState());

  if (stateBefore !== stateAfter) {
    button.textContent = 'Restart';
    button.className = 'button restart';
  }

  render();
});

render();
