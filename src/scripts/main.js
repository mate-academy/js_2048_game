'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const gameScoreSpan = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const gameFieldCells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

function renderBoard(board) {
  gameFieldCells.forEach((cell, index) => {
    const row = Math.floor(index / game.boardSize);
    const col = index % game.boardSize;
    const cellValue = board[row][col];

    cell.textContent = cellValue === 0 ? '' : cellValue;

    cell.classList.forEach((className) => {
      if (className.startsWith('field-cell--')) {
        cell.classList.remove(className);
      }
    });

    if (cellValue !== 0) {
      cell.classList.add(`field-cell--${cellValue}`);
    }
  });
}

function updateScore(score) {
  gameScoreSpan.textContent = score;
}

function updateMessages(statuse) {
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  if (statuse === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (statuse === 'win') {
    messageWin.classList.remove('hidden');
  } else if (statuse === 'pending') {
    messageStart.classList.remove('hidden');
  }
}

function updateUI() {
  renderBoard(game.getState());
  updateScore(game.getScore());
  updateMessages(game.getStatus());

  const currentStatus = game.getStatus();

  if (
    currentStatus === 'playing' ||
    currentStatus === 'win' ||
    currentStatus === 'lose'
  ) {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  }
}

startButton.addEventListener('click', () => {
  const currentStatus = game.getStatus();

  if (
    currentStatus === 'pending' ||
    currentStatus === 'lose' ||
    currentStatus === 'win'
  ) {
    game.start();
  } else if (currentStatus === 'playing') {
    game.restart();
  }
  updateUI();
});

document.addEventListener('keydown', (events) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (events.key) {
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

  updateUI();

  events.preventDefault();
});

document.addEventListener('DOMContentLoaded', () => {
  updateUI();
});
