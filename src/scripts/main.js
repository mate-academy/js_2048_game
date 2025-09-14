'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const start = document.querySelector('.start');
const restart = document.querySelector('.restart');
const scorE = document.querySelector('.game-score');

const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function all() {
  const state = game.getState();
  const score = game.getScore();

  scorE.textContent = score;

  cells.forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const column = i % 4;

    cell.className = 'field-cell';

    if (state[row][column] > 0) {
      cell.classList.add(`field-cell--${state[row][column]}`);
      cell.textContent = state[row][column];
    } else {
      cell.textContent = '';
    }
  });
}

function updateMessages() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    msgStart.classList.remove('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  }

  if (gameStatus === 'playing') {
    msgStart.classList.add('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  }

  if (gameStatus === 'win') {
    msgStart.classList.add('hidden');
    msgWin.classList.remove('hidden');
    msgLose.classList.add('hidden');
  }

  if (gameStatus === 'lose') {
    msgStart.classList.add('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.remove('hidden');
  }
}

start.addEventListener('click', () => {
  game.start();
  updateMessages();
  all();
  start.classList.add('hidden');
  restart.classList.remove('hidden');
});

restart.addEventListener('click', () => {
  game.restart();
  updateMessages();
  all();
  start.classList.remove('hidden');
  restart.classList.add('hidden');
});

document.addEventListener('keydown', (events) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (events.key) {
    case 'ArrowLeft':
      game.moveLeft();
      moved = true;
      break;

    case 'ArrowRight':
      game.moveRight();
      moved = true;
      break;

    case 'ArrowUp':
      game.moveUp();
      moved = true;
      break;

    case 'ArrowDown':
      game.moveDown();
      moved = true;
      break;
  }

  if (moved) {
    all();
    updateMessages();
  }
});

all();
