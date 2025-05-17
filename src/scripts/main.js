'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

function render() {
  const board = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  for (let row = 0; row < game.size; row++) {
    for (let col = 0; col < game.size; col++) {
      const value = board[row][col];
      const cell = cells[row * game.size + col];

      cell.className = 'field-cell';
      cell.textContent = value === 0 ? '' : value;

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  document.querySelector('.game-score').textContent = game.getScore();

  const winMsg = document.querySelector('.message-win');
  const loseMsg = document.querySelector('.message-lose');
  const startMsg = document.querySelector('.message-start');

  winMsg.classList.add('hidden');
  loseMsg.classList.add('hidden');
  startMsg.classList.add('hidden');

  const stat = game.getStatus();

  if (stat === 'win') {
    winMsg.classList.remove('hidden');
  }

  if (stat === 'lose') {
    loseMsg.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      moved = true;
      break;
    case 'ArrowRight':
      game.moveRight();
      moved = true;
      break;
    case 'ArrowUp':
      game.moveUp();
      moved = true;
      break;
    case 'ArrowDown':
      game.moveDown();
      moved = true;
      break;
  }

  if (moved) {
    render();
  }
});

document.querySelector('.start, .restart')?.addEventListener('click', () => {
  game.start();
  render();

  const btn = document.querySelector('.start, .restart');

  if (btn) {
    btn.classList.remove('start');
    btn.classList.add('restart');
    btn.textContent = 'Restart';
  }
});
