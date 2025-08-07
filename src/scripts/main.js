'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameField = document.querySelector('.game-field');

const fieldCells = [];
const rows = gameField.querySelectorAll('.field-row');

rows.forEach((row) => {
  const cells = row.querySelectorAll('.field-cell');

  fieldCells.push(Array.from(cells));
});

updateUI();

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      game.moveLeft();
      break;
    case 'ArrowRight':
      e.preventDefault();
      game.moveRight();
      break;
    case 'ArrowUp':
      e.preventDefault();
      game.moveUp();
      break;
    case 'ArrowDown':
      e.preventDefault();
      game.moveDown();
      break;
    default:
      return;
  }

  updateUI();
  updateMessages();
});

function updateUI() {
  scoreElement.textContent = game.getScore();

  const board = game.getState();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = fieldCells[row][col];
      const value = board[row][col];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
}

function updateMessages() {
  const gameStatus = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  switch (gameStatus) {
    case 'win':
      messageWin.classList.remove('hidden');
      break;
    case 'lose':
      messageLose.classList.remove('hidden');
      break;
    case 'idle':
      messageStart.classList.remove('hidden');
      break;
  }
}
