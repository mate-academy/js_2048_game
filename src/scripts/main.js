'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const rows = document.querySelectorAll('.field-row');

function updateBoard() {
  const state = game.getState();

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, colIndex) => {
      const value = state[rowIndex][colIndex];

      cell.textContent = value !== 0 ? value : '';
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });

  scoreEl.textContent = game.getScore();
}

function updateMessages() {
  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}

function handleMove(direction) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (direction) {
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

  updateBoard();
  updateMessages();
}

document.addEventListener('keydown', (e) => {
  const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (arrows.includes(e.key)) {
    e.preventDefault();
    handleMove(e.key);
  }
});

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startBtn.textContent = 'Restart';
    startBtn.classList.replace('start', 'restart');
  } else {
    game.restart();
    game.start();
  }

  updateBoard();
  updateMessages();
});
