'use strict';

import Game from '../modules/Game.class.js';

const boardElement = document.querySelector('.game-field tbody');
const scoreElement = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const restartButton = document.querySelector('.button.start');

const game = new Game();

function updateUI() {
  // eslint-disable-next-line no-shadow
  const { board, score, status } = game.getState();

  const newTbody = document.createElement('tbody');

  board.forEach((row) => {
    const tr = document.createElement('tr');

    tr.classList.add('field-row');

    row.forEach((value) => {
      const td = document.createElement('td');

      td.className = `field-cell cell-${value}`;
      td.textContent = value || '';
      tr.appendChild(td);
    });

    newTbody.appendChild(tr);
  });

  boardElement.innerHTML = '';
  boardElement.appendChild(newTbody);

  scoreElement.textContent = score;

  messageLose.classList.toggle('hidden', status !== 'lost');
  messageWin.classList.toggle('hidden', status !== 'won');
  messageStart.classList.toggle('hidden', status === 'playing');
}

// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const keyMap = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (keyMap[event.key]) {
    keyMap[event.key]();
    updateUI();
  }
});

restartButton.addEventListener('click', () => {
  game.start();
  updateUI();
});

updateUI();
