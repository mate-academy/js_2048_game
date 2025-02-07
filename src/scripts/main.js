'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.start');
const fieldCell = Array.from(document.querySelectorAll('.field-cell'));
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

  fieldCell.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const cellValue = state[row][col];

    cell.className = 'field-cell';

    if (cellValue === 0) {
      cell.textContent = '';
    } else {
      cell.classList.remove('hidden');
      cell.classList.add(`field-cell--${cellValue}`);
      cell.textContent = cellValue;
    }
  });

  const statusGame = game.getStatus();

  if (statusGame === 'win') {
    messageContainer.classList.remove('hidden');
    messageWin.classList.remove('hidden');
  } else if (statusGame === 'lose') {
    messageContainer.classList.remove('hidden');
    messageLose.classList.remove('hidden');
  } else if (statusGame === 'start') {
    messageStart.classList.add('hidden');
  }
}

const restartButton = document.querySelector('.restart');

restartButton.addEventListener('click', () => {
  game.restart();
  game.start();
  messageContainer.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');

  updatedId();
});

restartButton.classList.add('hidden');

startButton.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle' || gameStatus === 'lose' || gameStatus === 'win') {
    game.restart();
    game.start();
    messageContainer.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');

    restartButton.classList.remove('hidden');
    updatedId();
  }
});
