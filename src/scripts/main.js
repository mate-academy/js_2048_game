'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const scoreSpan = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start, .button.restart');
const cells = document.querySelectorAll('.field-cell');
const loseMsg = document.querySelector('.message-lose');
const winMsg = document.querySelector('.message-win');
const startMsg = document.querySelector('.message-start');

function renderBoard() {
  if (game.getStatus() === 'idle') {
    startBtn.textContent = 'Start';
    startBtn.classList.remove('restart');
    startBtn.classList.add('start');
  } else {
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  }

  const board = game.getState();

  cells.forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const col = 1 % 4;
    const value = board[row][col];

    cell.textContent = value || '';
    cell.className = `field-cell ${value ? ' field-cell--' + value : ''}`;
  });
  scoreSpan.textContent = game.getScore();

  loseMsg.classList.toggle('hidden', game.getStatus() !== 'lose');
  winMsg.classList.toggle('hidden', game.getStatus() !== 'win');
  startMsg.classList.toggle('hidden', game.getStatus() !== 'idle');
}

startBtn.addEventListener('click', () => {
  game.start();
  renderBoard();
});

document.addEventListener('keydown', (e) => {
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
  renderBoard();
});

renderBoard();
