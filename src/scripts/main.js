'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

// DOM elements
const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const mainButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateUI() {
  const board = game.getState();
  const gameStatus = game.getStatus();

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      const cellValue = board[i][j];
      const cellIndex = i * 4 + j;
      const cellElement = cells[cellIndex];

      clearCellClasses(cellElement);

      if (cellValue !== 0) {
        cellElement.textContent = cellValue;
        cellElement.classList.add(`field-cell--${cellValue}`);
      } else {
        cellElement.textContent = '';
      }
    }
  }

  scoreElement.textContent = game.getScore();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  mainButton.classList.remove('start', 'restart');

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
    mainButton.textContent = 'Start';
    mainButton.classList.add('start');
  } else if (gameStatus === 'playing') {
    mainButton.textContent = 'Restart';
    mainButton.classList.add('restart');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
    mainButton.textContent = 'Restart';
    mainButton.classList.add('restart');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
    mainButton.textContent = 'Restart';
    mainButton.classList.add('restart');
  }
}

function clearCellClasses(element) {
  const classesToRemove = [...element.classList].filter((className) => {
    return className.startsWith('field-cell--');
  });

  classesToRemove.forEach((className) => {
    element.classList.remove(className);
  });
}

mainButton.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  updateUI();
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
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

  updateUI();
});
