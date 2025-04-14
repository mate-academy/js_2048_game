'use strict';

import Game from '../modules/Game.class';

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
  let i = 0;
  const state = game.getState();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = cells[i];

      cell.className = 'field-cell';

      if (state[row][col]) {
        cell.textContent = state[row][col];
        cell.classList.add(`field-cell--${state[row][col]}`);
      } else {
        cell.textContent = '';
      }
      i++;
    }
  }

  document.querySelector('.game-score').textContent = game.getScore();

  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

buttonStart.addEventListener('click', () => {
  if (buttonStart.className === 'button restart') {
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
