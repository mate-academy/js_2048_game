'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const table = document.querySelector('.game-field');
const scoreDisplay = document.querySelector('.game-score');
const mainButton = document.querySelector('.start');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

let prevState = game.getState();

function updateField() {
  const currentState = game.getState();
  const cells = table.querySelectorAll('.field-cell');

  currentState.flat().forEach((value, idx) => {
    const cell = cells[idx];
    const prevVal = prevState[Math.floor(idx / 4)][idx % 4];

    cell.textContent = value !== 0 ? value : '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }

    if (value !== prevVal) {
      cell.classList.add('appear');
      setTimeout(() => cell.classList.remove('appear'), 100);
    }
  });

  prevState = currentState.map((row) => [...row]);
  scoreDisplay.textContent = game.getScore();

  msgStart.classList.toggle('hidden', game.getStatus() !== 'idle');
  msgWin.classList.toggle('hidden', game.getStatus() !== 'win');
  msgLose.classList.toggle('hidden', game.getStatus() !== 'lose');

  mainButton.textContent = game.getStatus() === 'idle' ? 'Start' : 'Restart';
  mainButton.classList.toggle('start', game.getStatus() === 'idle');
  mainButton.classList.toggle('restart', game.getStatus() !== 'idle');
}

mainButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  document
    .querySelectorAll('.message')
    .forEach((msg) => msg.classList.add('hidden'));

  updateField();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const keys = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (keys[e.key]) {
    keys[e.key]();

    updateField();
  }
});
