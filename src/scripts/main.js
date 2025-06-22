'use strict';

import Game from '../modules/Game.class.js';

let game = null;

const table = document.querySelector('.game-field');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function updateBoard() {
  if (!game) {
    return;
  }

  const state = game.getState();
  const cells = table.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = game.getScore();
  updateMessages();
}

function updateMessages() {
  const messageStatus = game?.getStatus?.() ?? 'idle';

  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

  if (messageStatus === 'idle') {
    msgStart.classList.remove('hidden');
  } else if (messageStatus === 'win') {
    msgWin.classList.remove('hidden');
  } else if (messageStatus === 'lose') {
    msgLose.classList.remove('hidden');
  }
}

function handleMove(key) {
  if (!game || game.getStatus() !== 'playing') {
    return;
  }

  const handleBefore = JSON.stringify(game.getState());

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

  const handleAfter = JSON.stringify(game.getState());

  if (handleBefore !== handleAfter) {
    updateBoard();
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
  }
}

startBtn.addEventListener('click', () => {
  if (!game) {
    game = new Game();
  }

  game.start();
  updateBoard();

  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
  startBtn.textContent = 'Restart';
});

document.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    handleMove(e.key);
  }
});

updateMessages();
