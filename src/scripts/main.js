'use strict';

import { Game } from '../modules/Game.class.js';

const boardElement = document.querySelector('.game-field tbody');
const scoreElement = document.querySelector('.game-score');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');
const startButton = document.querySelector('.start');

const game = new Game();

function updateUI() {
  const state = game.getState();

  boardElement.innerHTML = '';

  for (const row of state) {
    const tr = document.createElement('tr');

    for (const cell of row) {
      const td = document.createElement('td');

      td.className = 'field-cell';

      if (cell !== 0) {
        td.classList.add(`field-cell--${cell}`);
        td.textContent = cell;
      }
      tr.appendChild(td);
    }
    boardElement.appendChild(tr);
  }

  scoreElement.textContent = game.getScore();

  winMessage.classList.toggle('hidden', game.getStatus() !== 'win');
  loseMessage.classList.toggle('hidden', game.getStatus() !== 'lose');
  startMessage.classList.add('hidden');
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'inProgress') {
    return;
  }

  const keyMap = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (keyMap[e.key]) {
    keyMap[e.key]();
    updateUI();
  }
});

startButton.addEventListener('click', () => {
  game.restart();
  updateUI();
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
});
