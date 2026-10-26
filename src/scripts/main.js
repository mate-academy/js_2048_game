'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const button = document.querySelector('.button');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function updateBoard() {
  const board = game.getState();

  board.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.className = 'field-cell';
    cell.textContent = value === 0 ? '' : value;

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  const gameStatus = game.getStatus();

  startMessage.classList.toggle('hidden', gameStatus !== 'idle');

  winMessage.classList.toggle('hidden', gameStatus !== 'win');

  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

button.addEventListener('click', () => {
  const currentStatus = game.getStatus();

  if (currentStatus === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');

  updateBoard();
});

document.addEventListener('keydown', (keyboardEvent) => {
  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  const move = moves[keyboardEvent.key];

  if (!move) {
    return;
  }

  keyboardEvent.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  move();

  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');

  updateBoard();
});

updateBoard();
