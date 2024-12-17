'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const button = document.querySelector('button');

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

    updateState();
  }
});

function updateState() {
  const state = game.getState();
  let i = 0;

  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      const cell = cells[i];

      cell.className = 'field-cell';

      if (state[x][y] !== 0) {
        cell.textContent = state[x][y];
        cell.classList.add(`field-cell--${state[x][y]}`);
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

button.addEventListener('click', () => {
  if (button.className === 'button restart') {
    game.restart();
  }

  game.start();

  button.textContent = 'Restart';
  button.className = 'button restart';

  document.querySelector('.message-start').classList.add('hidden');

  updateState();
});
