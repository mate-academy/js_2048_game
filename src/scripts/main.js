'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const startButton = document.querySelector('.start');

function renderBoard() {
  const board = game.getState();
  const cells = gameField.querySelectorAll('.field-cell');
  let cellIndex = 0;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = cells[cellIndex];
      const value = board[row][col];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }

      cellIndex++;
    }
  }
}

function renderScore() {
  gameScore.textContent = game.getScore();
}

function renderMessage() {
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  if (game.getStatus() === Game.STATUS.win) {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === Game.STATUS.lose) {
    messageLose.classList.remove('hidden');
  } else if (game.getStatus() === Game.STATUS.idle) {
    messageStart.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === Game.STATUS.idle) {
    game.start();
  } else {
    game.restart();
  }

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');

  renderBoard();
  renderScore();
  renderMessage();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== Game.STATUS.playing) {
    return;
  }

  switch (e.key) {
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }

  renderBoard();
  renderScore();
  renderMessage();
});

renderBoard();
renderScore();
renderMessage();
