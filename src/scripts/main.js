'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const btnStart = document.querySelector('button.start');
const allCell = document.querySelectorAll('.field-cell');
const myScore = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const bestScoreEl = document.querySelector('.best-score');
let bestScore = Number(localStorage.getItem('bestScore')) || 0;

bestScoreEl.textContent = bestScore;

btnStart.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    renderBoard();
    myScore.textContent = game.getScore();
    btnStart.textContent = 'Restart';
    btnStart.classList.add('restart');
    btnStart.classList.remove('start');
  } else {
    game.restart();
    renderBoard();
    myScore.textContent = '0';
    btnStart.textContent = 'Start';
    btnStart.classList.remove('restart');
    btnStart.classList.add('start');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.remove('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (
    e.key === 'ArrowUp' ||
    e.key === 'ArrowDown' ||
    e.key === 'ArrowLeft' ||
    e.key === 'ArrowRight'
  ) {
    e.preventDefault();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }
  renderBoard();
  myScore.textContent = game.getScore();

  if (game.getScore() > bestScore) {
    bestScore = game.getScore();
    bestScoreEl.textContent = bestScore;
    localStorage.setItem('bestScore', bestScore);
  }

  if (game.getStatus() === 'win') {
    messageStart.classList.add('hidden');
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageStart.classList.add('hidden');
    messageLose.classList.remove('hidden');
  }

  if (game.getStatus() === 'playing') {
    messageStart.classList.add('hidden');
  }
});

function renderBoard() {
  for (let i = 0; i < game.getState().length; i++) {
    for (let j = 0; j < game.getState()[i].length; j++) {
      const cell = allCell[i * 4 + j];

      cell.textContent = '';
      cell.className = 'field-cell';

      if (game.getState()[i][j] !== 0) {
        cell.textContent = game.getState()[i][j];
        cell.classList.add(`field-cell--${game.getState()[i][j]}`);
      }
    }
  }
}

const btnMobile = document.querySelectorAll('.mobile-controls button');

btnMobile.forEach((button) => {
  button.addEventListener('click', () => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    const direction = button.dataset.move;

    if (direction === 'left') {
      game.moveLeft();
    }

    if (direction === 'right') {
      game.moveRight();
    }

    if (direction === 'up') {
      game.moveUp();
    }

    if (direction === 'down') {
      game.moveDown();
    }

    renderBoard();
    myScore.textContent = game.getScore();

    if (game.getStatus() === 'win') {
      messageStart.classList.add('hidden');
      messageWin.classList.remove('hidden');
    }

    if (game.getStatus() === 'lose') {
      messageStart.classList.add('hidden');
      messageLose.classList.remove('hidden');
    }

    if (game.getStatus() === 'playing') {
      messageStart.classList.add('hidden');
    }
  });
});
