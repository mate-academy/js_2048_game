// main.js
'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const board = game.getBoard();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell' + (value ? ` field-cell--${value}` : '');
  });

  scoreEl.textContent = game.getScore();
  messageStart.classList.toggle('hidden', game.getStatus() !== 'idle');
  messageWin.classList.toggle('hidden', game.getStatus() !== 'win');
  messageLose.classList.toggle('hidden', game.getStatus() !== 'lose');

  // зміна тексту і класу кнопки
  if (game.getStatus() === 'idle') {
    startBtn.textContent = 'Start';
    startBtn.classList.add('start');
    startBtn.classList.remove('restart');
  } else {
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  }
}

// клік по кнопці
startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  render();
});

document.addEventListener('keydown', (e) => {
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
  render();
});

// перший рендер (idle)
render();
