'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = [...document.querySelectorAll('.field-cell')];
const scoreElement = document.querySelector('.game-score');
const button = document.querySelector('.button');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = String(game.getScore());

  const maxValue = Math.max(...state.flat());

  button.className = 'button';

  if (game.getStatus() === 'idle') {
    button.classList.add('start');
    button.textContent = 'Start';
  } else {
    button.classList.add('restart');
    button.textContent = 'Restart';
  }

  if (game.getStatus() === 'playing' && maxValue > 0) {
    button.classList.add(`button--${maxValue}`);
  }

  startMessage.classList.toggle('hidden', game.getStatus() !== 'idle');
  winMessage.classList.toggle('hidden', game.getStatus() !== 'win');
  loseMessage.classList.toggle('hidden', game.getStatus() !== 'lose');
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
