'use strict';

// Uncomment the next lines to use your game instance in the browser

const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.button');
const scoreDisplay = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

startButton.addEventListener('click', () => {
  game.start();
  updateUI();
  messageStart.classList.add('hidden');
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
});

document.addEventListener('keydown', (evn) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (evn.key) {
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

  updateUI();
});

function updateUI() {
  const board = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  scoreDisplay.textContent = score;

  board.flat().forEach((value, i) => {
    const cell = cells[i];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else {
    messageWin.classList.add('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  } else {
    messageLose.classList.add('hidden');
  }
}
