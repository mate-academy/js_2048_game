'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const scoreElement = document.querySelector('.game-score');

function updateBoard() {
  const state = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  let index = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = state[row][col];
      const cell = cells[index];

      cell.textContent = value || '';
      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }

      index++;
    }
  }
}

function updateScore() {
  scoreElement.textContent = game.getScore();
}

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }

  updateBoard();
  updateScore();
  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
  }

  if (moved) {
    updateBoard();
    updateScore();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');

    const stat = game.getStatus();

    if (stat === 'win') {
      document.querySelector('.message-win').classList.remove('hidden');
    } else if (stat === 'lose') {
      document.querySelector('.message-lose').classList.remove('hidden');
    }
  }
});
