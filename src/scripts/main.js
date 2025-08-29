'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const cells = document.querySelectorAll('.field-cell');
const scoreElem = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

function updateBoard() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElem.textContent = game.getScore();

  winMessage.classList.toggle('hidden', game.getStatus() !== 'win');
  loseMessage.classList.toggle('hidden', game.getStatus() !== 'lose');
  startMessage.classList.toggle('hidden', game.getStatus() !== 'idle');
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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
});

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  } else {
    game.restart();
    startBtn.textContent = 'Start';
    startBtn.classList.remove('restart');
    startBtn.classList.add('start');
  }

  updateBoard();
});

updateBoard();
