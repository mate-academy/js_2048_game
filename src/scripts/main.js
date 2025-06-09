'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const gameCells = document.querySelectorAll('.field-cell');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function renderBoard() {
  const boardState = game.getState();

  boardState.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      const cellIndex = rowIndex * 4 + colIndex;
      const cellElement = gameCells[cellIndex];

      cellElement.className = 'field-cell';

      if (cellValue > 0) {
        cellElement.textContent = cellValue;
        cellElement.classList.add(`field-cell--${cellValue}`);
      } else {
        cellElement.textContent = '';
      }
    });
  });

  scoreElement.textContent = game.getScore();
}

function handleStartClick() {
  if (game.getStatus() === 'lose' || game.getStatus() === 'win') {
    game.restart();
  }
  game.start();
  renderBoard();
  updateUI();
}

startButton.addEventListener('click', handleStartClick);

document.addEventListener('keydown', (e) => {
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
    default:
      return;
  }

  renderBoard();
  updateUI();
});

function updateUI() {
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');

  const gameStatus = game.getStatus();

  if (gameStatus === 'playing') {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  }
}
