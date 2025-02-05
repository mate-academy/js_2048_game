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

  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (ev.key) {
    case 'ArrowUp':
      game.moveUp();
      break;

    case 'ArrowDown':
      game.moveDown();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      break;

    case 'ArrowRight':
      game.moveRight();
      break;

    default:
      break;
  }

  fillTable();
  score.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  game.checkAndSetLoseStatus();

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
