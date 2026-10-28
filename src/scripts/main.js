'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const cells = [...document.querySelectorAll('.field-cell')];
const scoreElement = document.querySelector('.game-score');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
let hasMoved = false;

function render() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const value = state[Math.floor(index / 4)][index % 4];

    [...cell.classList].forEach((className) => {
      if (className.startsWith('field-cell--')) {
        cell.classList.remove(className);
      }
    });

    cell.textContent = value || '';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();
  startMessage.classList.toggle('hidden', game.getStatus() !== 'idle');
  winMessage.classList.toggle('hidden', game.getStatus() !== 'win');
  loseMessage.classList.toggle('hidden', game.getStatus() !== 'lose');
  button.textContent = hasMoved ? 'Restart' : 'Start';
  button.classList.toggle('start', !hasMoved);
  button.classList.toggle('restart', hasMoved);
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else if (
    hasMoved ||
    game.getStatus() === 'win' ||
    game.getStatus() === 'lose'
  ) {
    game.restart();
    hasMoved = false;
  }

  render();
});

document.addEventListener('keydown', (keyboardEvent) => {
  const moves = {
    ArrowLeft: 'moveLeft',
    ArrowRight: 'moveRight',
    ArrowUp: 'moveUp',
    ArrowDown: 'moveDown',
  };
  const move = moves[keyboardEvent.key];

  if (!move) {
    return;
  }

  keyboardEvent.preventDefault();

  const previousState = game.getState();

  game[move]();

  if (JSON.stringify(previousState) !== JSON.stringify(game.getState())) {
    hasMoved = true;
  }

  render();
});

render();
