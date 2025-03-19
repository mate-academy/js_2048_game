'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const startButton = document.querySelector('.button-start');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateBoard() {
  const state = game.getState();

  state.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = document.querySelector(
        `[data-position="${rowIndex}-${colIndex}"]`,
      );

      if (!cell) {
        return;
      }

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
  const statusGame = game.getStatus();

  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  switch (statusGame) {
    case 'win':
      messageWin.classList.remove('hidden');
      break;
    case 'lose':
      messageLose.classList.remove('hidden');
      break;
    case 'idle':
      messageStart.classList.remove('hidden');
      break;
    default:
      break;
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
    updateMessages();
    updateScore();
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
  }
});

window.addEventListener('keydown', (ev) => {
  switch (ev.key) {
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
