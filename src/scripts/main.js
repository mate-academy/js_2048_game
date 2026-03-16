'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

function render() {
  const state = game.getState();

  cells.forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;

    const value = state[row][col];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = game.getScore();
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.textContent = 'Restart';
  } else {
    game.restart();
    button.textContent = 'Start';
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

    default:
      return;
  }

  render();
});
