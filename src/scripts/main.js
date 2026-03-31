'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.button');
const scoreSpan = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function updateUI() {
  const state = game.getState();
  const flatState = state.flat();

  cells.forEach((cell, index) => {
    const value = flatState[index];

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    } else {
      cell.textContent = '';
    }
  });

  scoreSpan.textContent = game.getScore();

  const gameStatus = game.getStatus();

  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

  if (gameStatus === 'idle') {
    msgStart.classList.remove('hidden');
    startBtn.textContent = 'Start';
    startBtn.className = 'button start';
  } else if (gameStatus === 'playing') {
    startBtn.textContent = 'Restart';
    startBtn.className = 'button restart';
  } else if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
    startBtn.textContent = 'Restart';
    startBtn.className = 'button restart';
  } else if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
    startBtn.textContent = 'Restart';
    startBtn.className = 'button restart';
  }
}

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const validKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (!validKeys.includes(e.key)) {
    return;
  }

  e.preventDefault();

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  updateUI();
});

updateUI();
