'use strict';
// Uncomment the next lines to use your game instance in the browser

import Game from '../modules/Game.class.js';

// Write your code here
const tbody = document.querySelector('tbody');
const startButton = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const scoreInfo = document.querySelector('.game-score');

const game = new Game();

const size = 4;

function renderBoard() {
  const state = game.getState();

  tbody.innerHTML = '';

  for (let row = 0; row < size; row++) {
    const rowElement = document.createElement('tr');

    for (let col = 0; col < size; col++) {
      const cellElement = document.createElement('td');
      const value = state[row][col];

      cellElement.classList.add('field-cell');

      if (value) {
        cellElement.classList.add(`field-cell--${value}`);
        cellElement.textContent = value;
      }
      rowElement.appendChild(cellElement);
    }
    tbody.appendChild(rowElement);
  }

  scoreInfo.textContent = game.getScore();

  const statusElement = game.getStatus();

  if (statusElement === 'win') {
    messageWin.classList.remove('hidden');
  } else if (statusElement === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function handleMove(direction) {
  if (game.getStatus() !== 'playing' || !started) {
    return;
  }

  const moved = {
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
  }[direction];

  if (moved) {
    moved();
    renderBoard();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  }
}

document.addEventListener('keydown', (ev) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(ev.key)) {
    handleMove(ev.key);
  }
});

let started = false;

startButton.addEventListener('click', () => {
  if (!started) {
    game.start();
    started = true;
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    started = true;
    messageLose.classList.add('hidden');
  }
  renderBoard();
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
});
