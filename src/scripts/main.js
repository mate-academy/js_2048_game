'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const element = {
  start: document.querySelector('.start'),
  restart: document.querySelector('.restart'),
  messageWin: document.querySelector('.message-win'),
  messageLose: document.querySelector('.message-lose'),
  messageStart: document.querySelector('.message-start'),
  cells: [...document.querySelectorAll('.field-cell')],
  score: document.querySelector('.game-score'),
};

const displayBoard = () => {
  game.state.forEach((row, rowIndex) => {
    const cellIndexCoefficient = rowIndex * 4;

    row.forEach((cell, cellIndex) => {
      const cellElement = element.cells[cellIndex + cellIndexCoefficient];
      const value = cell !== 0 ? cell : '';
      const cellClassName =
        cell === 0 ? 'field-cell' : `field-cell field-cell--${cell}`;

      cellElement.textContent = value;
      cellElement.className = cellClassName;
    });
  });

  element.score.textContent = game.score;

  if (game.currentStatus === game.status.playing) {
    element.messageStart.classList.add('hidden');
  }

  if (game.currentStatus === game.status.win) {
    element.messageWin.classList.remove('hidden');
  }

  if (game.currentStatus === game.status.lose) {
    element.messageLose.classList.remove('hidden');
  }
};

const updateStatus = () => {
  switch (game.getStatus()) {
    case game.status.win:
      game.currentStatus = game.status.win;
      break;
    case game.status.lose:
      game.currentStatus = game.status.lose;
      break;
    default:
      break;
  }
};

element.start.addEventListener('click', () => {
  game.start();
  element.start.classList.add('hidden');
  element.restart.classList.remove('hidden');
  displayBoard();
});

element.restart.addEventListener('click', () => {
  game.restart();
  element.restart.classList.add('hidden');
  element.start.classList.remove('hidden');
  element.start.classList.remove('hidden');
  element.messageStart.classList.remove('hidden');

  document.querySelector('.message-lose').className =
    'message message-lose hidden';

  element.messageWin.className = 'message message-win hidden';

  displayBoard();
});

document.addEventListener('keydown', (ev) => {
  if (game.getStatus() === 'playing') {
    switch (ev.key) {
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
    }
    updateStatus();
    displayBoard();
  }
});
