'use strict';

import Game from '../modules/Game.class';

const game = new Game();
const start = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const score = document.querySelector('.game-score');
const rows = document.querySelectorAll('.field-row');

start.addEventListener('click', () => {
  if (start.classList.contains('start')) {
    start.classList.remove('start');
    start.classList.add('restart');
    start.textContent = 'Restart';
    messageStart.classList.add('hidden');
    game.start();
    score.textContent = game.getScore();
  } else if (start.classList.contains('restart')) {
    start.classList.remove('restart');
    start.classList.add('start');
    start.textContent = 'Start';
    messageStart.classList.remove('hidden');
    game.restart();
    score.textContent = game.getScore();

    if (!messageWin.classList.contains('hidden')) {
      messageWin.classList.add('hidden');
    }

    if (!messageLose.classList.contains('hidden')) {
      messageLose.classList.add('hidden');
    }
  }

  fillTable();
});

document.addEventListener('keydown', (ev) => {
  ev.preventDefault();

  if (game.status === 'idle') {
    return;
  }

  if (ev.key === 'ArrowUp') {
    game.moveUp();
  }

  if (ev.key === 'ArrowDown') {
    game.moveDown();
  }

  if (ev.key === 'ArrowRight') {
    game.moveRight();
  }

  if (ev.key === 'ArrowLeft') {
    game.moveLeft();
  }

  fillTable();
  score.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
});

function fillTable() {
  for (let i = 0; i < game.state.length; i++) {
    const cells = rows[i].querySelectorAll('td');

    for (let j = 0; j < game.state[i].length; j++) {
      const value = game.state[i][j];

      cells[j].className = 'field-cell';

      if (value > 0) {
        cells[j].textContent = value;
        cells[j].classList.add(`field-cell--${value}`);
      } else {
        cells[j].textContent = '';
      }
    }
  }
}
