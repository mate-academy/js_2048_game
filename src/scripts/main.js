'use strict';

import { Game } from './Game.class.js';

const game = new Game();
const startButton = document.querySelector('button.start');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

startButton.addEventListener('click', () => {
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  if (messageStart) {
    messageStart.classList.add('hidden');
  } // Handle optional message-start
  game.start();
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  renderBoard(game.getState());
  renderScore(game.getScore());
  updateGameStatus();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
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
  }

  if (moved) {
    renderBoard(game.getState());
    renderScore(game.getScore());
    updateGameStatus();
  }
});

function renderBoard(board) {
  const cells = document.querySelectorAll('.field-cell');

  board.flat().forEach((value, index) => {
    cells[index].textContent = value || '';
    cells[index].className = `field-cell field-cell--${value || 0}`;
  });
}

function renderScore(score) {
  const scoreEl = document.querySelector('.game-score');

  scoreEl.textContent = score;
}

function updateGameStatus() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }
}
