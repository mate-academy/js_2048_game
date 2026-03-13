'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function render(state) {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const r = Math.floor(index / 4);
    const c = index % 4;

    const value = state[r][c];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }

    if (game.getStatus() === 'win') {
      game.checkWin();
      messageWin.classList.remove('hidden');
      messageStart.classList.add('hidden');
    }

    if (game.getStatus() === 'lose') {
      messageLose.classList.remove('hidden');
      messageStart.classList.add('hidden');
    }
  });
  score.textContent = game.getScore();
}

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
  render(game.getState());
});

button.addEventListener('click', (e) => {
  if (!game.hasStarted) {
    game.start();
    render(game.getState());

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';

    messageStart.classList.add('hidden');
  } else {
    game.restart();
    button.classList.add('start');
    button.classList.remove('restart');
    button.textContent = 'Start';

    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.remove('hidden');
    render(game.getState());
  }
});
