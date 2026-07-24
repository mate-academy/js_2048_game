'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

let hasMoved = false;

const moveHandlers = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

function renderBoard() {
  const values = game.getState().flat();

  cells.forEach((cell, index) => {
    const value = values[index];

    cell.className = 'field-cell';
    cell.textContent = value || '';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function renderScore() {
  scoreEl.textContent = game.getScore();
}

function renderMessages() {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function renderButton() {
  button.classList.toggle('start', !hasMoved);
  button.classList.toggle('restart', hasMoved);
  button.textContent = hasMoved ? 'Restart' : 'Start';
}

function render() {
  renderBoard();
  renderScore();
  renderMessages();
  renderButton();
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    hasMoved = false;
  }

  render();
});

document.addEventListener('keydown', (ev) => {
  const handler = moveHandlers[ev.key];

  if (!handler || game.getStatus() !== 'playing') {
    return;
  }

  handler();
  hasMoved = true;
  render();
});

render();
