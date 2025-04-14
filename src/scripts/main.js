'use strict';

const Game = require('../modules/Game.class');
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
    for (let column = 0; column < 4; column++) {
      const cell = cells[i];

      cell.className = 'field-cell';

      if (state[row][column]) {
        cell.textContent = state[row][column];
        cell.classList.add(`field-cell--${state[row][column]}`);
      } else {
        cell.textContent = '';
      }
      i++;
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
