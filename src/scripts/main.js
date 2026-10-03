'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

import { Game } from '../modules/Game.class.js';

const game = new Game();

const board = document.querySelector('.game-field tbody');
const score = document.querySelector('.game-score');
const startButton = document.querySelector('.start');

function render() {
  const state = game.getState();

  board.innerHTML = '';

  state.forEach((row) => {
    const tableRow = document.createElement('tr');

    tableRow.classList.add('field-row');

    row.forEach((value) => {
      const cell = document.createElement('td');

      cell.classList.add('field-cell');

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }

      tableRow.appendChild(cell);
    });

    board.appendChild(tableRow);
  });

  score.textContent = game.getScore();

  updateMessages();
}

function updateMessages() {
  const gameStatus = game.getStatus();

  document
    .querySelector('.message-start')
    .classList.toggle('hidden', gameStatus !== 'idle');

  document
    .querySelector('.message-win')
    .classList.toggle('hidden', gameStatus !== 'win');

  document
    .querySelector('.message-lose')
    .classList.toggle('hidden', gameStatus !== 'lose');

  startButton.textContent = gameStatus === 'idle' ? 'Start' : 'Restart';

  startButton.classList.toggle('start', gameStatus === 'idle');

  startButton.classList.toggle('restart', gameStatus !== 'idle');
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (keyEvent) => {
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

    case 'ArrowDown':
      game.moveDown();
      break;

    default:
      return;
  }

  render();
});

render();
