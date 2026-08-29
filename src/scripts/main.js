'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function updateBoard() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;

    const value = state[row][column];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  });

  score.textContent = game.getScore();

  updateStatus();
}

function updateStatus() {
  const gameStatus = game.getStatus();

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (gameStatus === 'idle') {
    startMessage.classList.remove('hidden');

    button.textContent = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');
  }

  if (gameStatus === 'playing') {
    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
  }

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  updateBoard();
});

document.addEventListener('keydown', (keyboardEvent) => {
  switch (keyboardEvent.key) {
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

  updateBoard();
});

updateBoard();
