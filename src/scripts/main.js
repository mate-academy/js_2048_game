'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const field = document.querySelector('.game-field tbody');
const score = document.querySelector('.game-score');
const start = document.querySelector('.start');

function render() {
  const state = game.getState();
  const currentStatus = game.getStatus();

  field.innerHTML = '';

  state.forEach((row) => {
    const rowEl = document.createElement('tr');

    row.forEach((cell) => {
      const cellEl = document.createElement('td');

      cellEl.classList.add('field-cell');

      if (cell > 0) {
        cellEl.classList.add(`field-cell--${cell}`);
        cellEl.textContent = cell;
      }
      rowEl.appendChild(cellEl);
    });

    field.appendChild(rowEl);
  });

  score.textContent = game.getScore();

  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const messageStart = document.querySelector('.message-start');

  messageWin.classList.toggle('hidden', currentStatus !== 'win');
  messageLose.classList.toggle('hidden', currentStatus !== 'lose');
  messageStart.classList.toggle('hidden', currentStatus !== 'idle');

  if (currentStatus === 'win') {
    alert('You win! 🎉');
  } else if (currentStatus === 'lose') {
    alert('Game over! 💀');
  }
}

start.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    start.textContent = 'Restart';
    start.classList.add('restart');
  } else {
    game.restart();
  }
  render();
});

document.addEventListener('keydown', (e) => {
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
    render();
  }
});

render();
