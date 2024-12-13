'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState();

  const rows = gameField.querySelectorAll('.field-row');

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, cellIndex) => {
      const value = state[rowIndex][cellIndex];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });

  gameScore.textContent = game.getScore();

  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
  } else {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}

document.addEventListener('keydown', (keyboardEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (keyboardEvent.key) {
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

function startGame() {
  game.start();
  renderBoard();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
}

function restartGame() {
  game.restart();
  renderBoard();

  messageStart.classList.remove('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  startButton.textContent = 'Start';
  startButton.classList.remove('restart');
  startButton.classList.add('start');
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startGame();
  } else {
    restartGame();
  }
});

renderBoard();
