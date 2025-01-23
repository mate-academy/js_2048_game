'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

// Write your code here

const startButton = document.querySelector('.button.start');

startButton.addEventListener('click', () => {
  game.start();
  updateBoard();
  updateScore();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  updateBoard();
  updateScore();

  if (game.getStatus() === 'win') {
    alert('You win!');
  }

  if (game.getStatus() === 'lose') {
    alert('Game over!');
  }
});

function updateBoard() {
  const state = game.getState();
  const field = document.querySelector('.game-field');
  const rows = field.querySelectorAll('.field-row');

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, colIndex) => {
      const value = state[rowIndex][colIndex];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });
}

function updateScore() {
  document.querySelector('.game-score').textContent = game.getScore();
}
