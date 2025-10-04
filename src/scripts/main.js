'use strict';

const Game = require('../modules/Game.class.js');

const startBtn = document.querySelector('.button.start');
const scoreEl = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

const game = new Game();

function updateMessages(getStatus) {
  msgStart.classList.toggle('hidden', getStatus !== 'idle');
  msgWin.classList.toggle('hidden', getStatus !== 'win');
  msgLose.classList.toggle('hidden', getStatus !== 'lose');
}

function renderBoard() {
  const board = game.getState();

  board.flat().forEach((value, index) => {
    const cell = cells[index];
    const prev = cell.textContent;

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);

      if (!prev) {
        cell.classList.add('field-cell--animated');
      }
    }
  });

  scoreEl.textContent = game.getScore();
  updateMessages(game.getStatus());
}

function updateButtonLabel() {
  const getStatus = game.getStatus();

  if (getStatus === 'idle') {
    startBtn.classList.add('start');
    startBtn.classList.remove('restart');
    startBtn.textContent = 'Start';
  } else {
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
  }
}

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  updateButtonLabel();
  renderBoard();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing' && game.getStatus() !== 'idle') {
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
    renderBoard();
  }
});

renderBoard();
