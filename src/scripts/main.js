'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button.start');
const score = document.querySelector('.game-score');
const cells = Array.from(document.querySelectorAll('.field-cell'));

const lose = document.querySelector('.message-lose');
const win = document.querySelector('.message-win');
const start = document.querySelector('.message-start');

function setMessage() {
  const gameStatus = game.getStatus();

  lose.classList.add('hidden');
  win.classList.add('hidden');
  start.classList.add('hidden');

  switch (gameStatus) {
    case 'lose':
      lose.classList.remove('hidden');
      break;
    case 'win':
      win.classList.remove('hidden');
      break;
    case 'idle':
      start.classList.remove('hidden');
      break;
  }
}

function render() {
  const board = game.getState();

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const cell = cells[i * 4 + j];
      const value = board[i][j];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  score.textContent = game.getScore();
}

startButton.addEventListener('click', () => {
  game.start();
  render();
  setMessage();

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
});

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
    default:
      return;
  }

  render();
  setMessage();
});
