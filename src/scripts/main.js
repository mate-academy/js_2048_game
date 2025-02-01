'use strict';

const Game = require('../modules/Game.class');

const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');
const initialRows = [...document.querySelectorAll('.field-row')];
const score = document.querySelector('.game-score');
const game = new Game();

startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  restartButton.style.display = 'block';
  document.querySelector('.message-start').classList.add('hidden');

  game.start();
  updateBoard();
});

restartButton.addEventListener('click', () => {
  game.restart();
  score.textContent = 0;
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  updateBoard();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing' && !game.state.isAnimating) {
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
    updateBoard();

    if (game.getStatus() === 'gameover') {
      document.querySelector('.message-lose').classList.remove('hidden');
    }
  }
  score.textContent = game.getScore();
});

function updateBoard() {
  const board = game.getState();

  initialRows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, cellIndex) => {
      const value = board[rowIndex][cellIndex];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });
}
