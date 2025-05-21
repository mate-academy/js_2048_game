'use strict';

const Game = require('../modules/Game.class.js');

const game = new Game();

const startButton = document.querySelector('.button');

function numBoard(currentGame) {
  const state = currentGame.getState();
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.className = 'field-cell';
    cell.textContent = value || '';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

document.querySelector('.game-score').textContent = game.getScore();

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

startMessage?.classList.add('hidden');

function updateMessage() {
  const currentStatus = game.getStatus();

  winMessage?.classList.toggle('hidden', currentStatus !== 'win');
  loseMessage?.classList.toggle('hidden', currentStatus !== 'lose');
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
  numBoard(game);
  document.querySelector('.game-score').textContent = game.getScore();
  updateMessage();
});

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else {
    game.restart();
  }

  numBoard(game);
  document.querySelector('.game-score').textContent = game.getScore();
});
