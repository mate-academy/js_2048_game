'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const cells = [...document.querySelectorAll('.field-cell')];

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState().flat();

  cells.forEach((cell, index) => {
    const value = state[index];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    }
  });
}

function renderMessages() {
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (game.getStatus() === 'idle') {
    startMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

function renderButton() {
  if (game.getStatus() === 'idle') {
    button.classList.add('start');
    button.classList.remove('restart');
    button.textContent = 'Start';

    return;
  }

  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
}

function render() {
  score.textContent = game.getScore();

  renderBoard();
  renderMessages();
  renderButton();
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  render();
});

document.addEventListener('keydown', (keyboardEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  const move = moves[keyboardEvent.key];

  if (!move) {
    return;
  }

  keyboardEvent.preventDefault();

  move();
  render();
});

render();

