'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button.start');

const updateField = () => {
  const state = game.getState();

  cells.forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;

    cell.className = 'field-cell';
    cell.textContent = state[row][col] || '';

    if (state[row][col]) {
      cell.classList.add(`field-cell--${state[row][col]}`);
    }
  });

  const gameStatus = game.getStatus();

  document
    .querySelector('.message-win')
    .classList.toggle('hidden', gameStatus !== 'win');

  document
    .querySelector('.message-lose')
    .classList.toggle('hidden', gameStatus !== 'lose');
};

const updateScore = () => {
  document.querySelector('.game-score').textContent = game.getScore();
};

document.querySelector('.game-score').textContent = game.getScore();

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === Game.STATUS.playing) {
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

    updateField();
    updateScore();
  }
});

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    game.restart();
  } else {
    game.start();
  }

  updateField();
  updateScore();

  document
    .querySelectorAll('.message-win, .message-lose, .message-start')
    .forEach((el) => el.classList.add('hidden'));

  startButton.textContent = 'Restart';
  startButton.className = 'button restart';
});
