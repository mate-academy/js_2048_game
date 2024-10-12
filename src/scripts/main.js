'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const displayBoard = () => {
  game.state.forEach((row, rowIndex) => {
    const cellIndexCoefficient = rowIndex * 4;

    row.forEach((cell, cellIndex) => {
      const cellElement = [...document.querySelectorAll('.field-cell')][
        cellIndex + cellIndexCoefficient
      ];
      const value = cell !== 0 ? cell : '';
      const cellClassName =
        cell === 0 ? 'field-cell' : `field-cell field-cell--${cell}`;

      cellElement.textContent = value;
      cellElement.className = cellClassName;
    });
  });

  document.querySelector('.game-score').textContent = game.score;

  if (game.currentStatus === game.status.win) {
    document.querySelector('.message-start').classList.add('hidden');
    document.querySelector('.message-win').classList.remove('hidden');
  }

  if (game.currentStatus === game.status.lose) {
    document.querySelector('.message-start').classList.add('hidden');
    document.querySelector('.message-lose').classList.remove('hidden');
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

document.querySelector('.start').addEventListener('click', () => {
  game.start();
  document.querySelector('.start').classList.add('hidden');
  document.querySelector('.restart').classList.remove('hidden');
  displayBoard();
});

document.querySelector('.restart').addEventListener('click', () => {
  game.restart();
  document.querySelector('.restart').classList.add('hidden');
  document.querySelector('.start').classList.remove('hidden');
  document.querySelector('.message-start').classList.remove('hidden');

  document.querySelector('.message-lose').className =
    'message message-lose hidden';

  document.querySelector('.message-win').className =
    'message message-win hidden';

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
