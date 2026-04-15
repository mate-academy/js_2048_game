'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
// const game = new Game();
// import Game from './modules/Game.class.js';

const game = new Game();

render();

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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
    default:
      return;
  }

  render();
});

function render() {
  const state = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value || '';

    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  document.querySelector('.game-score').textContent = game.getScore();

  ['win', 'lose'].forEach((type) => {
    document
      .querySelector(`.message-${type}`)
      .classList.toggle('hidden', game.getStatus() !== type);
  });
}
