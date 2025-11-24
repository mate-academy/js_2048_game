'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const startButton = document.querySelector('.button.start');

function renderGame() {
  const cells = document.querySelectorAll('.field-cell');
  const state = game.getState();

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = state[r][c];
      const cell = cells[r * 4 + c];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  document.querySelector('.game-score').textContent = game.getScore();

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else {
    document.querySelector('.message-win').classList.add('hidden');
  }

  if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  } else {
    document.querySelector('.message-lose').classList.add('hidden');
  }

  if (game.getStatus() === 'playing' || game.getStatus() === 'idle') {
    startButton.textContent = 'Restart';
  } else {
    startButton.textContent = 'Start';
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle' || game.getStatus() === 'lose') {
    game.start();
  } else if (game.getStatus() === 'playing') {
    game.restart();
  }
  renderGame();
});

window.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
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

  renderGame();
});
