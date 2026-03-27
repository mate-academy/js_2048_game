'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

const button = document.querySelector('.button');
const fieldCell = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');

const start = document.querySelector('.message-start');
const lose = document.querySelector('.message-lose');
const win = document.querySelector('.message-win');

function renderBoard() {
  for (let i = 0; i <= 15; i++) {
    const r = Math.floor(i / 4);
    const c = i % 4;
    const value = game.getState()[r][c];

    if (value === 0) {
      fieldCell[i].textContent = '';
    } else {
      fieldCell[i].textContent = value;
    }

    fieldCell[i].className = 'field-cell';

    if (value !== 0) {
      fieldCell[i].classList.add(`field-cell--${value}`);
    }
  }
}

button.addEventListener('click', (e) => {
  if (game.getStatus() === 'playing') {
    game.restart();
    score.textContent = game.getScore();

    return renderBoard();
  }

  if (game.getStatus() === 'lose') {
    game.restart();
    score.textContent = game.getScore();
    lose.classList.add('hidden');

    return renderBoard();
  }

  if (game.getStatus() === 'win') {
    game.restart();
    score.textContent = game.getScore();
    win.classList.add('hidden');

    return renderBoard();
  }

  game.start();
  renderBoard();
  start.classList.add('hidden');
  button.textContent = 'restart';
  button.classList.remove('start');
  button.classList.add('restart');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    game.moveDown();
    renderBoard();
    score.textContent = game.getScore();

    if (game.getStatus() === 'win') {
      win.classList.remove('hidden');
    }

    if (game.getStatus() === 'lose') {
      lose.classList.remove('hidden');
    }

    if (game.getStatus() === 'playing') {
      return;
    }
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    renderBoard();
    score.textContent = game.getScore();

    if (game.getStatus() === 'win') {
      win.classList.remove('hidden');
    }

    if (game.getStatus() === 'lose') {
      lose.classList.remove('hidden');
    }

    if (game.getStatus() === 'playing') {
      return;
    }
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    renderBoard();
    score.textContent = game.getScore();

    if (game.getStatus() === 'win') {
      win.classList.remove('hidden');
    }

    if (game.getStatus() === 'lose') {
      lose.classList.remove('hidden');
    }

    if (game.getStatus() === 'playing') {
      return;
    }
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    renderBoard();
    score.textContent = game.getScore();

    if (game.getStatus() === 'win') {
      win.classList.remove('hidden');
    }

    if (game.getStatus() === 'lose') {
      lose.classList.remove('hidden');
    }

    if (game.getStatus() === 'playing') {
    }
  }
});
