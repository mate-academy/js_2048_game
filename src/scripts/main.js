'use strict';

// Uncomment the next lines to use your game instance in the browser
// document.addEventListener("DOMContentLoaded", () => {
const Game = require('../modules/Game.class');
const game = new Game();
const button = document.querySelector('.start');
// const cells = document.querySelectorAll('.field-cell');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerHTML = 'Restart';
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
    document.querySelector('.message-start').classList.add('hidden');
    document.querySelector('.message-restart').classList.remove('hidden');
    game.start();
    updateUI();
  } else if (button.classList.contains('restart')) {
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
    document.querySelector('.message-start').classList.add('hidden');
    document.querySelector('.message-restart').classList.remove('hidden');
    game.score = 0;
    document.querySelector('.game-score').innerHTML = game.score;
    game.start();
    updateUI();
    // game.generateTwoRandomCells(document.querySelectorAll(".field-cell"));
  }
});

document.addEventListener('keydown', (e) => {
  const directions = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (directions.includes(e.key) && game.getStatus() === 'playing') {
    game.handleMove(e.key);
    updateUI();
  }
});

function updateUI() {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = game.board[row][col];

    cell.innerHTML = value === 0 ? '' : value;

    // очистити старі класи
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
  // перевірка на перемогу (2048)

  if (game.status === 'playing' && game.board.flat().includes(2048)) {
    game.status = 'win';
    document.querySelector('.message-restart').classList.add('hidden');
    document.querySelector('.message-win').classList.remove('hidden');
  }

  // перевірка на поразку
  if (game.isGameOver() && game.status !== 'lose') {
    game.status = 'lose';
    document.querySelector('.message-restart').classList.add('hidden');
    document.querySelector('.message-lose').classList.remove('hidden');
  }

  // gameOverMessage.classList.remove("hidden");
}
// });
