'use strict';

import Game from '../modules/Game.class';

const ARROW_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

const game = new Game();

const button = document.querySelector('.button');
const scoreField = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState();

  fieldRows.forEach((fieldRow, row) => {
    const cells = fieldRow.querySelectorAll('.field-cell');

    cells.forEach((cell, col) => {
      const value = state[row][col];

      cell.className = 'field-cell';
      cell.textContent = value === 0 ? '' : value;

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });
}

function renderButton() {
  const isIdle = game.getStatus() === 'idle';

  button.classList.toggle('start', isIdle);
  button.classList.toggle('restart', !isIdle);
  button.textContent = isIdle ? 'Start' : 'Restart';
}

function renderMessages() {
  const gameStatus = game.getStatus();

  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

function render() {
  renderBoard();
  renderButton();
  renderMessages();
  scoreField.textContent = game.getScore();
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
  if (!ARROW_KEYS.includes(keyEvent.key)) {
    return;
  }

  keyEvent.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (keyEvent.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;

    case 'ArrowRight':
      game.moveRight();
      break;

    case 'ArrowUp':
      game.moveUp();
      break;

    default:
      game.moveDown();
      break;
  }

  render();
});

render();
