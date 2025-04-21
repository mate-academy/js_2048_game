'use strict';

import { Game } from '../modules/Game.class';

const game = new Game();

game.start();

const startButton = document.querySelector('.button');

startButton.addEventListener('click', () => {
  game.restart();
  game.start();
  renderGame();

  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';

  hideMessages();
});

document.addEventListener('keydown', handleKeyDown);

function renderGame() {
  const cells = document.querySelectorAll('.field-cell');
  const state = game.getState();

  let cellIndex = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = cells[cellIndex];

      cell.className = 'field-cell';

      const value = state[row][col];

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;

        cell.classList.add('field-cell--appear');

        setTimeout(() => {
          cell.classList.remove('field-cell--appear');
        }, 200);
      } else {
        cell.textContent = '';
      }

      cellIndex++;
    }
  }

  document.querySelector('.game-score').textContent = game.getScore();

  if (game.status === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (game.status === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

function hideMessages() {
  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
}

function handleKeyDown(ev) {
  if (game.status !== 'playing') {
    return;
  }

  switch (ev.key) {
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
      break;
  }

  renderGame();
}
