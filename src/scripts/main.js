'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const button = document.querySelector('.button');

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
  updateButton();
  updateMessages();
});

const cells = document.querySelectorAll('.field-cell');

const scoreElement = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

document.addEventListener('keydown', (Keyevent) => {
  switch (Keyevent.key) {
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

  render();
  updateMessages();
});

function render() {
  const board = game.getState();

  board.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = cells[rowIndex * 4 + colIndex];

      cell.className = 'field-cell';
      cell.textContent = value === 0 ? '' : value;

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });

  scoreElement.textContent = game.getScore();
}

function updateButton() {
  if (game.getStatus() === 'idle') {
    button.textContent = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');
  } else {
    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
  }
}

function updateMessages() {
  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}
