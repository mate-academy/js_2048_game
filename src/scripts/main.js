'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const field = document.querySelector('.game-field');

function update() {
  const state = game.getState();
  const tiles = field.querySelectorAll('.field-cell');

  tiles.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const value = state[row][column];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  score.textContent = game.getScore();

  switch (game.getStatus()) {
    case 'win':
      messageWin.classList.remove('hidden');
      messageLose.classList.add('hidden');
      break;
    case 'lose':
      messageWin.classList.add('hidden');
      messageLose.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
    switch (e.key) {
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
      case 'ArrowUp':
        game.moveUp();
        break;
    }
    game.updateStatus();
    update();
  }
});

button.addEventListener('click', () => {
  game.start();
  update();
  button.textContent = 'Restart';
  button.classList.replace('start', 'restart');
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
});
