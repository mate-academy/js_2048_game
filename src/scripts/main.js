'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const button = document.querySelector('.button');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let hasMoved = false;

function render() {
  const state = game.getState();

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

  scoreElement.textContent = game.getScore();

  startMessage.classList.toggle('hidden', game.getStatus() !== 'idle');

  winMessage.classList.toggle('hidden', game.getStatus() !== 'win');

  loseMessage.classList.toggle('hidden', game.getStatus() !== 'lose');

  if (hasMoved) {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    render();

    return;
  }

  if (hasMoved) {
    game.restart();
    hasMoved = false;

    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');

    render();
  }
});

document.addEventListener('keydown', (keyboardEvent) => {
  const moves = {
    ArrowLeft: 'moveLeft',
    ArrowRight: 'moveRight',
    ArrowUp: 'moveUp',
    ArrowDown: 'moveDown',
  };

  const move = moves[keyboardEvent.key];

  if (!move || game.getStatus() !== 'playing') {
    return;
  }

  keyboardEvent.preventDefault();

  const previousState = JSON.stringify(game.getState());

  game[move]();

  const currentState = JSON.stringify(game.getState());

  if (previousState !== currentState) {
    hasMoved = true;
    render();
  }
});

render();
