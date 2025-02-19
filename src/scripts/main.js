'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const button = document.querySelector('.button');
const rows = document.querySelectorAll('.field-row');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const score = document.querySelector('.game-score');

function startGame() {
  game.start();
  updateBoard();
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  this.status = 'ongoing';
  button.classList.add('restart');
  button.textContent = 'Restart';
}

function updateBoard() {
  score.textContent = game.score;

  rows.forEach((row, rowIndex) => {
    row.querySelectorAll('.field-cell').forEach((cell, colIndex) => {
      const tileValue = game.board[rowIndex][colIndex];

      cell.textContent = tileValue;

      if (tileValue === 0) {
        cell.textContent = '';
      }

      cell.className = 'field-cell';

      if (tileValue !== 0) {
        cell.classList.add(`field-cell--${tileValue}`);
      }
    });
  });

  if (game.hasWon()) {
    this.status = 'win';
    winMessage.classList.remove('hidden');
  }

  if (game.hasLost()) {
    this.status = 'lose';
    loseMessage.classList.remove('hidden');
  }
}

button.addEventListener('click', startGame);

document.addEventListener('keyup', (events) => {
  let moved = false;

  switch (events.key) {
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
  }

  if (moved) {
    game.addRandomTile();
    updateBoard();
  }
});
