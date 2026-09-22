'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const startBtn = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const updateUI = () => {
  const board = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  scoreElement.textContent = score;

  let cellIndex = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = board[row][col];
      const cell = cells[cellIndex];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }

      cellIndex++;
    }
  }

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
  }
};

startBtn.addEventListener('click', () => {
  game.restart();

  startBtn.textContent = 'Restart';
  startBtn.classList.remove('start');
  startBtn.classList.add('restart');

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let isMoved = false;

  switch (e.key) {
    case 'ArrowLeft':
      isMoved = game.moveLeft();
      break;

    case 'ArrowRight':
      isMoved = game.moveRight();
      break;

    case 'ArrowUp':
      isMoved = game.moveUp();
      break;

    case 'ArrowDown':
      isMoved = game.moveDown();
      break;
  }

  if (isMoved) {
    updateUI();
  }
});
