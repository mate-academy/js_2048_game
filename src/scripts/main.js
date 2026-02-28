'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button');
const scoreDisplay = document.querySelector('.game-score');
const messageOverlay = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const render = () => {
  const board = game.getState().flat();

  scoreDisplay.textContent = game.getScore();

  cells.forEach((cellElement, index) => {
    const cellValue = board[index];

    Array.from(cellElement.classList).forEach((currentClass) => {
      if (currentClass.startsWith('field-cell--')) {
        cellElement.classList.remove(currentClass);
      }
    });

    if (cellValue > 0) {
      cellElement.textContent = cellValue;
      cellElement.classList.add(`field-cell--${cellValue}`);
    } else {
      cellElement.textContent = '';
    }
  });
};

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    render();
  } else {
    game.restart();
    render();
  }

  messageOverlay.classList.add('hidden');
  startButton.textContent = 'Restart';
  startButton.className = 'button restart';
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  } else if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  render();

  const currentStatus = game.getStatus();

  if (currentStatus === 'win') {
    winMessage.classList.remove('hidden');
  } else if (currentStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
});
