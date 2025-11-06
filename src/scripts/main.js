'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

document.querySelector('.start').addEventListener('click', (e) => {
  game.start();

  e.target.classList.remove('start');
  e.target.classList.add('restart');
  e.target.textContent = 'Restart';
  document.querySelector('.message-start').hidden = true;
  rerender();

  document.querySelector('.restart').addEventListener('click', () => {
    game.restart();
    rerender();
  });
});

function rerender() {
  const state = [...game.getState()].flat();

  document.querySelectorAll('.game-field td').forEach((el) => {
    const value = state.shift();

    if (value) {
      el.textContent = value;
      el.className = `field-cell field-cell--${value}`;
    } else {
      el.textContent = '';
      el.className = `field-cell`;
    }
  });

  document.querySelector('.game-score').textContent = game.getScore();

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }

  rerender();
});
