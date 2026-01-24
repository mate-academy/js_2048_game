'use strict';

import { Game } from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

if (!startButton || !messageStart || !messageLose) {
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const prevState = game.getState().map((r) => r.slice());

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
    default:
      return;
  }

  const nextState = game.getState();
  const changed = JSON.stringify(prevState) !== JSON.stringify(nextState);

  if (changed) {
    renderBoard(nextState);
    updateGameStatus();
  }
});

function renderBoard(board) {
  const cells = document.querySelectorAll('.field-cell');

  if (cells.length !== 16) {
    return;
  }

  board.flat().forEach((value, index) => {
    const cell = cells[index];

    if (!cell) {
      return;
    }

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  renderScore(game.getScore());
}

function renderScore(score) {
  const scoreEl = document.querySelector('.game-score');

  if (scoreEl) {
    scoreEl.textContent = score;
  }
}

function updateGameStatus() {
  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus === 'playing');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');

  if (messageWin) {
    messageWin.classList.toggle('hidden', gameStatus !== 'win');
  }
}

startButton.addEventListener('click', () => {
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');

  if (game.getStatus() === 'playing') {
    game.restart();
  } else {
    game.start();
  }

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');

  renderBoard(game.getState());
  updateGameStatus();
});
