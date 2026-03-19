'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const scoreElement = document.querySelector('.game-score');
const button = document.querySelector('.button');

const startMessageElement = document.querySelector('.message-start');
const winMessageElement = document.querySelector('.message-win');
const loseMessageElement = document.querySelector('.message-lose');

const cells = document.querySelectorAll('.field-cell');

const updateGame = () => {
  const score = game.getScore();
  const currentStatus = game.getStatus();
  const board = game.getState();

  scoreElement.textContent = score;

  for (let i = 0; i < cells.length; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = board[row][col];

    cells[i].textContent = value === 0 ? '' : value;
    cells[i].className = `field-cell field-cell--${value}`;
  }

  if (currentStatus === 'idle') {
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');

    startMessageElement.classList.remove('hidden');
    winMessageElement.classList.add('hidden');
    loseMessageElement.classList.add('hidden');
  }

  if (currentStatus === 'playing') {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');

    startMessageElement.classList.add('hidden');
    winMessageElement.classList.add('hidden');
    loseMessageElement.classList.add('hidden');
  }

  if (currentStatus === 'win') {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');

    startMessageElement.classList.add('hidden');
    winMessageElement.classList.remove('hidden');
    loseMessageElement.classList.add('hidden');
  }

  if (currentStatus === 'lose') {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');

    startMessageElement.classList.add('hidden');
    winMessageElement.classList.add('hidden');
    loseMessageElement.classList.remove('hidden');
  }
};

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  updateGame();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = true;

  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      game.moveUp();
      break;
    case 'ArrowDown':
      e.preventDefault();
      game.moveDown();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      game.moveLeft();
      break;
    case 'ArrowRight':
      e.preventDefault();
      game.moveRight();
      break;

    default:
      moved = false;
  }

  if (moved) {
    updateGame();
  }
});
