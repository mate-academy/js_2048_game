'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const scoreElement = document.querySelector('.game-score');
const startButton = document.getElementById('startButton');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messagePlaying = document.querySelector('.message-playing');

function updateBoard() {
  const state = game.getState();

  state.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = document.querySelector(
        `[data-position="${rowIndex}-${colIndex}"]`,
      );

      cell.textContent = value !== 0 ? value : '';
      updateCellClass(cell, value);
    });
  });
}

function updateCellClass(cell, value) {
  cell.className = 'field-cell';

  if (value !== 0) {
    cell.classList.add(`field-cell--${value}`);
  }
}

function updateScore() {
  scoreElement.textContent = game.getScore();
}

function updateMessages() {
  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  if (status === 'win') {
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');
    messagePlaying.classList.add('hidden');
  } else if (status === 'lose') {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
    messagePlaying.classList.add('hidden');
  } else if (status === 'playing') {
    messagePlaying.classList.remove('hidden');
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  } else {
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messagePlaying.classList.add('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    updateBoard();
    updateMessages();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else {
    game.restart();
    updateBoard();
    updateScore();
    updateMessages();
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
  }
});

// eslint-disable-next-line no-shadow
window.addEventListener('keydown', (event) => {
  switch (event.key) {
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
  updateScore();
  updateMessages();
});
