'use strict';

const Game = require('../modules/Game.class.js');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElem = document.querySelector('.game-score');
const startBtn = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState().flat();

  cells.forEach((cell, idx) => {
    const val = state[idx];

    cell.textContent = val === 0 ? '' : val;
    cell.className = 'field-cell';

    if (val) {
      cell.classList.add(`field-cell--${val}`);
    }
  });
  scoreElem.textContent = game.getScore();
  updateMessages();
}

function updateMessages() {
  const gameStatus = game.getStatus();

  msgStart.classList.toggle('hidden', gameStatus !== 'idle');
  msgWin.classList.toggle('hidden', gameStatus !== 'win');
  msgLose.classList.toggle('hidden', gameStatus !== 'lose');

  if (gameStatus === 'playing') {
    startBtn.classList.replace('start', 'restart');
    startBtn.textContent = 'Restart';
  } else {
    startBtn.classList.replace('restart', 'start');
    startBtn.textContent = 'Start';
  }
}

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  renderBoard();
});

document.addEventListener('keydown', (e) => {
  const key = e.key;

  switch (key) {
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

renderBoard();
