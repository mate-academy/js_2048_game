'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here

const field = document.querySelector('.game-field');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button');
const startMsg = document.querySelector('.message-start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState();
  const cells = field.querySelectorAll('.field-cell');

  cells.forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function updateUI() {
  scoreEl.textContent = game.getScore();
  renderBoard();

  const gameStatus = game.getStatus();

  winMsg.classList.toggle('hidden', gameStatus !== 'win');
  loseMsg.classList.toggle('hidden', gameStatus !== 'lose');
  startMsg.classList.add('hidden');

  if (gameStatus === 'playing') {
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  }
}

startBtn.addEventListener('click', () => {
  game.start();
  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const keyActions = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (keyActions[e.key]) {
    keyActions[e.key]();
    updateUI();
  }
});
