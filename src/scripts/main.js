'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const startButton = document.querySelector('.button');

startButton.addEventListener('click', () => {
  if (
    game.status === 'win' ||
    game.status === 'lose' ||
    game.status === 'playing'
  ) {
    game.restart();
    renderMessages(game.status);
  }

  game.start();
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart game';

  renderBoard(game.getState());
  renderScore(game.getScore());
  renderMessages(game.status);
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (evt.key === 'ArrowRight') {
    game.moveRight();
  }

  if (evt.key === 'ArrowUp') {
    game.moveUp();
  }

  if (evt.key === 'ArrowDown') {
    game.moveDown();
  }

  renderBoard(game.getState());
  renderScore(game.getScore());
  renderMessages(game.status);
});

function renderBoard(board) {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const value = board[Math.floor(index / 4)][index % 4];

    cell.textContent = value !== 0 ? value : '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function renderScore(score) {
  document.querySelector('.game-score').textContent = score;
}

function renderMessages(statusValue) {
  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');

  if (statusValue === 'playing') {
    messageStart.classList.add('hidden');

    if (!messageLose.classList.contains('hidden')) {
      messageLose.classList.add('hidden');
    }
  }

  if (statusValue === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (statusValue === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (statusValue === 'idle') {
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}
