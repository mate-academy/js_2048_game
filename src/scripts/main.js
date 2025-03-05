'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const tbody = document.querySelector('tbody');
const buttonStart = document.querySelector('.button');
let isStarted = false;

buttonStart.addEventListener('click', () => {
  if (buttonStart.classList.contains('start')) {
    isStarted = true;
    game.start();
    updateField();
    document.querySelector('.message-start').classList.add('hidden');
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    buttonStart.textContent = 'Restart';

    return;
  }

  if (buttonStart.classList.contains('restart')) {
    isStarted = false;
    game.restart();
    updateField();
    document.querySelector('.message-start').classList.remove('hidden');
    buttonStart.classList.remove('restart');
    buttonStart.classList.add('start');
    buttonStart.textContent = 'Start';

    if (!document.querySelector('.message-win').classList.contains('hidden')) {
      document.querySelector('.message-win').classList.add('hidden');
    }

    if (!document.querySelector('.message-lose').classList.contains('hidden')) {
      document.querySelector('.message-lose').classList.add('hidden');
    }
  }

  buttonStart.blur();
});

document.addEventListener('keydown', (e) => {
  if (!isStarted) {
    return;
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

  updateField();

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
    isStarted = false;
  }

  if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
    isStarted = false;
  }
});

function updateField() {
  const score = game.getScore();
  const state = game.getState();

  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[i].length; j++) {
      if (state[i][j] !== 0) {
        tbody.rows[i].cells[j].textContent = state[i][j];

        tbody.rows[i].cells[j].className =
          `field-cell field-cell--${state[i][j]}`;
      } else {
        tbody.rows[i].cells[j].textContent = '';
        tbody.rows[i].cells[j].className = 'field-cell';
      }
    }
  }
  document.querySelector('.game-score').textContent = score;
}
