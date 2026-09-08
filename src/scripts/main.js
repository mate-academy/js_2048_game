'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  }

  if (game.getStatus() === 'win' || game.getStatus() === 'lose') {
    game.restart();
  }

  render();
});

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

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

function render() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;

    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
  score.textContent = game.getScore();

  const statusGame = game.getStatus();

  button.className = 'button';

  if (statusGame === 'idle') {
    button.classList.add('start');
    button.textContent = 'Start';
  } else {
    button.classList.add('restart');
    button.textContent = 'Restart';
  }

  startMessage.classList.toggle('hidden', game.getStatus() !== 'idle');

  winMessage.classList.toggle('hidden', game.getStatus() !== 'win');

  loseMessage.classList.toggle('hidden', game.getStatus() !== 'lose');
}

render();
