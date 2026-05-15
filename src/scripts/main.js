'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  for (let row = 0; row < state.length; row++) {
    for (let col = 0; col < state[row].length; col++) {
      const cellIndex = row * 4 + col;
      const cell = cells[cellIndex];
      const value = state[row][col];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
  score.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  }

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (gameStatus === 'idle') {
    button.textContent = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');
  } else {
    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
  }
}

button.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;

    case 'ArrowRight':
      game.moveRight();
      break;

    case 'ArrowUp':
      game.moveUp();
      break;

    case 'ArrowDown':
      game.moveDown();
      break;
  }
  render();
});
