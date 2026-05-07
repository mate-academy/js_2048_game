'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const fieldCells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const btn = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLosse = document.querySelector('.message-lose');

function renderBoard() {
  for (let cell = 0; cell < fieldCells.length; cell++) {
    const row = Math.floor(cell / 4);
    const col = cell % 4;
    const value = game.getState()[row][col];

    fieldCells[cell].textContent = value === 0 ? '' : value;

    fieldCells[cell].className = 'field-cell';

    if (value !== 0) {
      fieldCells[cell].classList.add(`field-cell--${value}`);
    }
  }

  score.textContent = game.getScore();

  checkStatus();
}

btn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    messageStart.classList.add('hidden');
    btn.classList.remove('start');
    btn.classList.add('restart');

    renderBoard();
  } else if (
    game.getStatus() === 'playing' ||
    game.getStatus() === 'win' ||
    game.getStatus() === 'lose'
  ) {
    game.restart();
    game.start();
    messageWin.classList.add('hidden');
    messageLosse.classList.add('hidden');
    renderBoard();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    renderBoard();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    renderBoard();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    renderBoard();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    renderBoard();
  }
});

function checkStatus() {
  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageLosse.classList.remove('hidden');
  }
}
