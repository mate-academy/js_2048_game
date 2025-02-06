'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.start');
const fieldCell = document.querySelector('.field-cell');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const gameScore = document.querySelector('.game-score');
const messageContainer = document.querySelector('.message-container');

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;

    case 'ArrowRight':
      game.moveRight();
      break;

    case 'ArrowDown':
      game.moveDown();
      break;

    case 'ArrowUp':
      game.moveUp();
      break;
  }

  updatedId();
});

function updatedId() {
  const state = game.getState();
  const score = game.getScore();

  gameScore.textContent = score;

  fieldCell.forEach((value, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;

    const cellValue = state[row][col];

    if (cellValue === 0) {
      value.classList.add('hidden');
      value.textContent = '';
    } else {
      value.classList.remove('hidden');
      value.classList.add(`field-cell--${cellValue}`);
      value.textContent = cellValue;
    }
  });

  const statusGame = game.getStatus();

  if (statusGame === 'win') {
    messageContainer.classList.remove('hidden');
    messageWin.classList.remove('hidden');
  }

  if (statusGame === 'lose') {
    messageContainer.classList.remove('hidden');
    messageLose.classList.remove('hidden');
  }

  if (statusGame === 'start') {
    messageStart.classList.add('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (
    game.getStatus === 'start' ||
    game.getStatus === 'lose' ||
    game.getStatus === 'start'
  ) {
    game.start();
    game.restart();
    messageStart.classList.add('hidden');
    updatedId();
  }
});
