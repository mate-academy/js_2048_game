'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const buttonStart = document.querySelector('.button.start');

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
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
    }

    updateView();
  }
});

function updateView() {
  let index = 0;
  const state = game.getState();

  for (let row = 0; row < game.size; row++) {
    for (let col = 0; col < game.size; col++) {
      const cell = cells[index];

      cell.className = 'field-cell';

      if (state[row][col]) {
        cell.textContent = state[row][col];
        cell.classList.add(`field-cell--${state[row][col]}`);
      } else {
        cell.textContent = '';
      }
      index++;
    }
  }

  document.querySelector('.game-score').textContent = game.getScore();

  const statusGame = game.getStatus();

  if (statusGame === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (statusGame === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

buttonStart.addEventListener('click', () => {
  if (game.getStatus() !== 'idle') {
    game.restart();
  }

  game.start();
  updateView();
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-start').classList.add('hidden');
  buttonStart.textContent = 'Restart';
  buttonStart.className = 'button restart';
});
