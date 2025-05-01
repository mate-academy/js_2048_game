'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const fieldElement = document.querySelector('.game-field tbody');
const scoreElement = document.querySelector('.game-score');
const messageElements = document.querySelectorAll(
  '.message-container .message',
);
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const buttonStart = document.querySelector('.button.start');

render();

function render() {
  fieldElement.innerHTML = '';

  const state = game.getState();

  for (let row = 0; row < state.length; row++) {
    const tr = document.createElement('tr');

    tr.classList.add('field-row');

    for (let col = 0; col < state[row].length; col++) {
      const value = state[row][col];
      const cell = document.createElement('td');

      cell.classList.add('field-cell');

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
      tr.appendChild(cell);
    }
    fieldElement.appendChild(tr);
  }

  scoreElement.textContent = game.getScore();

  const stats = game.getStatus();

  messageElements.forEach((el) => el.classList.add('hidden'));

  if (stats === 'win') {
    messageWin.classList.remove('hidden');
  } else if (stats === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (stats === 'idle') {
    messageStart.classList.remove('hidden');
    buttonStart.textContent = 'Start';
    buttonStart.classList.add('start');
    buttonStart.classList.remove('restart');
  } else if (stats === 'playing') {
    buttonStart.textContent = 'Restart';
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
  }
}

document.addEventListener('keydown', (ev) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (ev.key === 'ArrowUp') {
    game.moveUp();
  } else if (ev.key === 'ArrowDown') {
    game.moveDown();
  } else if (ev.key === 'ArrowRight') {
    game.moveRight();
  } else if (ev.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (game.isGameOver()) {
    game.status = 'lose';
  }

  render();
});

buttonStart.addEventListener('click', () => {
  game.start();
  render();
  buttonStart.textContent = 'Restart';
  buttonStart.classList.remove('start');
  buttonStart.classList.add('restart');
});
