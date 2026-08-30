'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const rowElements = document.querySelectorAll('.field-row');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const directionHandlers = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

let hasMoved = false;

function renderBoard() {
  const state = game.getState();

  rowElements.forEach((rowElement, r) => {
    const cellElements = rowElement.querySelectorAll('.field-cell');

    cellElements.forEach((cellElement, c) => {
      const value = state[r][c];

      cellElement.className = 'field-cell';
      cellElement.textContent = '';

      if (value !== 0) {
        cellElement.classList.add(`field-cell--${value}`);
        cellElement.textContent = value;
      }
    });
  });
}

function renderScore() {
  scoreElement.textContent = game.getScore();
}

function renderMessages() {
  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}

function render() {
  renderBoard();
  renderScore();
  renderMessages();
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
  } else {
    game.restart();
    hasMoved = false;
    startButton.classList.replace('restart', 'start');
    startButton.textContent = 'Start';
  }

  render();
});

document.addEventListener('keydown', (e) => {
  const handleMove = directionHandlers[e.key];

  if (!handleMove || game.getStatus() !== 'playing') {
    return;
  }

  e.preventDefault();

  const stateBefore = game.getState();

  handleMove();

  const hasChanged =
    JSON.stringify(stateBefore) !== JSON.stringify(game.getState());

  if (hasChanged && !hasMoved) {
    hasMoved = true;
    startButton.classList.replace('start', 'restart');
    startButton.textContent = 'Restart';
  }

  render();
});

render();
