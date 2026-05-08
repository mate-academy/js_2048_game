'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

// Write your code here

function updateBoard() {
  const state = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  state.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = cells[rowIndex * 4 + colIndex];

      cell.textContent = value || '';
      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });

  document.querySelector('.game-score').textContent = game.getScore();
}

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  game.start();
  updateBoard();

  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');

  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
    let moved = false;

    if (e.key === 'ArrowLeft') {
      moved = game.moveLeft();
    } else if (e.key === 'ArrowRight') {
      moved = game.moveRight();
    } else if (e.key === 'ArrowUp') {
      moved = game.moveUp();
    } else if (e.key === 'ArrowDown') {
      moved = game.moveDown();
    }

    if (moved) {
      game.start();
      updateBoard();

      if (game.getStatus() === 'won') {
        document.querySelector('.message-win').classList.remove('hidden');
      } else if (game.getStatus() === 'lost') {
        document.querySelector('.message-lose').classList.remove('hidden');
      }
    }
  }
});
