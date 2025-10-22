'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
const Game = require('../modules/Game.class');

const game = new Game();
const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button');
const startMsg = document.querySelector('.message-start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');

function updateUI() {
  const state = game.getState();

  cells.forEach((cell, i) => {
    const val = state[Math.floor(i / 4)][i % 4];

    cell.textContent = val === 0 ? '' : val;
    cell.className = 'field-cell';

    if (val) {
      cell.classList.add(`field-cell--${val}`);
    }
  });

  scoreEl.textContent = game.getScore();
  winMsg.classList.toggle('hidden', game.getStatus() !== 'won');
  loseMsg.classList.toggle('hidden', game.getStatus() !== 'lose');
}

startBtn.addEventListener('click', () => {
  game.start();
  updateUI();
  startMsg.classList.add('hidden');
  startBtn.textContent = 'Restart';
  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  if (e.key === 'ArrowLeft') {
    moved = game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    moved = game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    moved = game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    moved = game.moveDown();
  }

  if (moved) {
    updateUI();
  }
});
