'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
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
    renderGame();
  }
});

const button = document.querySelector('.start');

button.addEventListener('click', () => {
  if (game.getStatus() === 'playing') {
    game.restart();
    renderGame();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }

  if (game.getStatus() === 'win') {
    game.restart();
    renderGame();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }

  if (game.getStatus() === 'lose') {
    game.restart();
    renderGame();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }

  if (game.getStatus() === 'idle') {
    game.start();
    renderGame();
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }
});

const renderGame = () => {
  const fieldCells = document.querySelectorAll('.field-cell');

  // Clear the board
  fieldCells.forEach((cell) => {
    cell.textContent = '';
    cell.classList.remove('field-cell--2');
    cell.classList.remove('field-cell--4');
    cell.classList.remove('field-cell--8');
    cell.classList.remove('field-cell--16');
    cell.classList.remove('field-cell--32');
    cell.classList.remove('field-cell--64');
    cell.classList.remove('field-cell--128');
    cell.classList.remove('field-cell--256');
    cell.classList.remove('field-cell--512');
    cell.classList.remove('field-cell--1024');
    cell.classList.remove('field-cell--2048');
  });

  // Render the game state
  for (let row = 0; row < game.size; row++) {
    for (let col = 0; col < game.size; col++) {
      const cellIndex = row * game.size + col;
      const cellValue = game.board[row][col];

      if (cellValue !== 0) {
        fieldCells[cellIndex].textContent = cellValue;
        fieldCells[cellIndex].classList.add('field-cell');
        fieldCells[cellIndex].classList.add(`field-cell--${cellValue}`);
      }
    }
  }

  // Update score
  document.querySelector('.game-score').textContent = `${game.score}`;

  const win = document.querySelector('.message-win');
  const lose = document.querySelector('.message-lose');
  const start = document.querySelector('.message-start');

  if (game.getStatus() === 'win') {
    win.classList.remove('hidden');
    lose.classList.add('hidden');
    start.classList.add('hidden');
  }

  if (game.getStatus() === 'lose') {
    win.classList.add('hidden');
    lose.classList.remove('hidden');
    start.classList.add('hidden');
  }

  if (game.getStatus() === 'playing') {
    win.classList.add('hidden');
    lose.classList.add('hidden');
    start.classList.add('hidden');
  }
};
