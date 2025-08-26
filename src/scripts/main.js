'use strict';

import Game from '../modules/Game.class.js';

const boardElement = document.querySelector('.game-field');
const startBtn = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

const game = new Game();

function renderBoard() {
  const state = game.getState();
  const rows = boardElement.querySelectorAll('tr');

  state.forEach((row, r) => {
    const cells = rows[r].querySelectorAll('td');

    row.forEach((value, c) => {
      const cell = cells[c];

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
    });
  });

  scoreElement.textContent = game.getScore();
}

function updateMessages() {
  const gameStatus = game.getStatus();

  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

  if (gameStatus === 'won') {
    msgWin.classList.remove('hidden');
  }

  if (gameStatus === 'over') {
    msgLose.classList.remove('hidden');
  }
}

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
    msgStart.classList.add('hidden');
  } else {
    game.restart();
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  }

  renderBoard();
});

document.addEventListener('keydown', (keyboardEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (keyboardEvent.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    default:
      break;
  }

  if (moved) {
    renderBoard();
    updateMessages();
  }
});
