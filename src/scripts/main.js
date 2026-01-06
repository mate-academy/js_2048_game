'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');

const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

const cells = document.querySelectorAll('.field-cell');

function render() {
  const state = game.getState();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = state[row][col];
      const index = row * 4 + col;
      const cell = cells[index];

      cell.textContent = '';
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
}

button.addEventListener('click', () => {
  const stat = game.getStatus();

  if (stat === 'idle') {
    game.start();
    msgStart.classList.add('hidden');
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();
    msgLose.classList.add('hidden');
    msgWin.classList.add('hidden');
    msgStart.classList.add('hidden');
  }

  render();
  updateMessages();
  scoreEl.textContent = game.getScore();
});

document.addEventListener('keydown', function (ev) {
  if (game.getStatus() === 'playing') {
    if (ev.key === 'ArrowUp') {
      game.moveUp();
    }

    if (ev.key === 'ArrowDown') {
      game.moveDown();
    }

    if (ev.key === 'ArrowLeft') {
      game.moveLeft();
    }

    if (ev.key === 'ArrowRight') {
      game.moveRight();
    }

    const isArrow =
      ev.key === 'ArrowRight' ||
      ev.key === 'ArrowLeft' ||
      ev.key === 'ArrowUp' ||
      ev.key === 'ArrowDown';

    if (isArrow) {
      ev.preventDefault();
      render();
      updateMessages();
      scoreEl.textContent = game.getScore();
    }
  }
});

function updateMessages() {
  if (game.getStatus() === 'idle') {
    msgStart.classList.remove('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  }

  if (game.getStatus() === 'playing') {
    msgStart.classList.add('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  }

  if (game.getStatus() === 'win') {
    msgStart.classList.add('hidden');
    msgWin.classList.remove('hidden');
    msgLose.classList.add('hidden');
  }

  if (game.getStatus() === 'lose') {
    msgStart.classList.add('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.remove('hidden');
  }
}

updateMessages();
