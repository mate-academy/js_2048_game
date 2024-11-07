/* eslint-disable no-shadow */
'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const button = document.querySelector('.button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    renderBoard(game);
    updateMessage();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else {
    game.restart();
    renderBoard(game);
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    updateMessage('start');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.defaultPrevented || game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
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
      return;
  }

  if (moved) {
    renderBoard(game);

    if (button.classList.contains('start')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
    }

    if (game.isWinner()) {
      updateMessage('win');
      button.classList.remove('restart');
      button.classList.add('start');
      button.textContent = 'Start';

      return;
    }

    if (game.isGameOver()) {
      updateMessage('lose');
      button.classList.remove('restart');
      button.classList.add('start');
      button.textContent = 'Start';

      return;
    }
  }

  e.preventDefault();
});

function renderBoard(game) {
  const board = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cellIndex = row * 4 + col;
      const cell = cells[cellIndex];

      if (board[row][col] === 0) {
        cell.textContent = '';
        cell.className = 'field-cell';
      } else {
        cell.textContent = board[row][col];
        cell.className = `field-cell field-cell--${board[row][col]}`;
      }
    }
  }

  const scoreElement = document.querySelector('.game-score');
  const score = game.getScore();

  scoreElement.innerHTML = '';
  scoreElement.textContent = score;
}

function updateMessage(type) {
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');

  if (type === 'win') {
    messageWin.classList.remove('hidden');
  } else if (type === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (type === 'start') {
    messageStart.classList.remove('hidden');
  }
}
