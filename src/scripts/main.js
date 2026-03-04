'use strict';

const ROWS_COUNT = 4;
const CELLS_COUNT = 4;
const Game = require('../modules/Game.class');
const game = new Game();

const info = document.querySelector('.info');
const msg = document.querySelector('.message-container');

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.button');

  if (!btn) {
    return;
  }

  if (btn.classList.contains('start')) {
    game.start();
    btn.textContent = 'Restart';
    btn.classList.replace('start', 'restart');
  } else {
    game.restart();
    game.start();
    btn.textContent = 'Restart';
  }
  update();
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  if (game.status !== 'playing') {
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

  update();
});

function update() {
  const gameStatus = game.getStatus();
  const board = game.getState();
  const score = game.getScore();
  const startMsg = msg.querySelector('.message-start');
  const winMsg = msg.querySelector('.message-win');
  const loseMsg = msg.querySelector('.message-lose');

  info.querySelector('span').textContent = score;

  if (gameStatus === 'idle') {
    startMsg.classList.add('hidden');
  }

  if (gameStatus === 'playing') {
    startMsg.classList.add('hidden');
    winMsg.classList.add('hidden');
    loseMsg.classList.add('hidden');
  }

  if (gameStatus === 'win') {
    winMsg.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    loseMsg.classList.remove('hidden');
  }

  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const r = Math.floor(index / ROWS_COUNT);
    const c = index % CELLS_COUNT;
    const value = board[r][c];

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });
}
