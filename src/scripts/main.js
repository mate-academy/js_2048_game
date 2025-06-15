'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here

const gameFieldElement = document.querySelector('.game-field tbody');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function renderBoard() {
  const board = game.getState();
  const cells = gameFieldElement.querySelectorAll('.field-cell');

  let cellIndex = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = cells[cellIndex];
      const value = board[r][c];

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
      }
      cellIndex++;
    }
  }

  scoreElement.textContent = game.getScore();
  updateGameStatusMessage();
}

function updateGameStatusMessage() {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  const currentGameState = game.getStatus();

  if (currentGameState === 'win') {
    messageWin.classList.remove('hidden');
  } else if (currentGameState === 'gameOver') {
    messageLose.classList.remove('hidden');
  } else if (currentGameState === 'pending') {
    messageStart.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  game.start();
  renderBoard();
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
});

document.addEventListener('keydown', (e) => {
  const currentGameState = game.getStatus();

  if (currentGameState !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    default:
      return;
  }

  if (moved) {
    renderBoard();
  }
});

renderBoard();
