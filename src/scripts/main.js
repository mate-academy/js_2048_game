'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function updateBoard() {
  const board = game.getState();
  const cells = gameField.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row] ? board[row][col] : 0;

    cell.textContent = value > 0 ? value : '';

    const oldClasses = Array.from(cell.classList).filter(function (c) {
      return c.startsWith('field-cell--');
    });

    cell.classList.remove(...oldClasses); // remove old classes

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function updateUI() {
  updateBoard();
  gameScore.textContent = game.getScore();

  messageStart.classList.toggle('hidden', game.getStatus() !== 'idle');
  messageLose.classList.toggle('hidden', game.getStatus() !== 'lose');
  messageWin.classList.toggle('hidden', game.getStatus() !== 'win');

  if (game.getStatus() === 'playing') {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else {
    startButton.classList.add('start');
    startButton.classList.remove('restart');
    startButton.textContent = 'Start';
  }
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
  } else {
    game.restart();
  }
  updateUI();
});

document.addEventListener('keydown', (e) => {
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
  }
  updateUI();
});

updateUI();
