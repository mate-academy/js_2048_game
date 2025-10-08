'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();
const score = document.querySelector('.game-score');
const btn = document.querySelector('.button.start');
const lose = document.querySelector('.message-lose');
const win = document.querySelector('.message-win');
const start = document.querySelector('.message-start');
const tr = document.querySelectorAll('.field-row');

function render() {
  const uiBoard = game.getState();

  score.textContent = game.getScore();

  for (let i = 0; i < 4; i++) {
    const cells = tr[i].querySelectorAll('.field-cell');

    for (let j = 0; j < 4; j++) {
      const cell = cells[j];
      const value = uiBoard[i][j];

      cell.textContent = '';
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  if (game.getStatus() === 'idle') {
    btn.classList.add('start');
    btn.classList.remove('restart');
    btn.textContent = 'Start';
  } else {
    btn.classList.add('restart');
    btn.classList.remove('start');
    btn.textContent = 'Restart';
  }

  // eslint-disable-next-line no-console
  console.log(game.getStatus());

  if (game.getStatus() !== 'idle') {
    start.classList.add('hidden');

    if (game.getStatus() === 'lose') {
      lose.classList.remove('hidden');
    }

    if (game.getStatus() === 'win') {
      win.classList.remove('hidden');
    }
  } else {
    start.classList.remove('hidden');
    lose.classList.add('hidden');
    win.classList.add('hidden');
  }
}

btn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  render();
});

document.addEventListener('keydown', (e) => {
  const key = e.key;
  // let moved = false;

  if (key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (key === 'ArrowRight') {
    game.moveRight();
  }

  if (key === 'ArrowUp') {
    game.moveUp();
  }

  if (key === 'ArrowDown') {
    game.moveDown();
  }

  render();
});

render();
