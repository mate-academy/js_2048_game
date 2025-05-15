'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const field = document.querySelector('.game-field');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();
  const cells = field.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = game.getScore();

  // Handle game status
  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else {
    messageWin.classList.add('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  } else {
    messageLose.classList.add('hidden');
  }
}

function startGame() {
  game.start();
  render();
  startBtn.textContent = 'Restart';
  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
}

startBtn.addEventListener('click', () => {
  startGame();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      return;
  }

  render();
});
