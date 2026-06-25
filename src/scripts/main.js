'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

function render() {
  const board = game.getState();
  let cellIndex = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = board[r][c];
      const cell = cells[cellIndex];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }

      cellIndex++;
    }
  }

  scoreElement.textContent = game.getScore();
}

function updateUI() {
  const gameStatus = game.getStatus();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.add('hidden');

  if (gameStatus === 'idle') {
    startMessage.classList.remove('hidden');
    startButton.textContent = 'Start';
  } else if (gameStatus === 'playing') {
    startButton.textContent = 'Restart';
    startButton.classList.replace('start', 'restart');
  } else if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
    startButton.textContent = 'Restart';
  } else if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
    startButton.textContent = 'Restart';
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  updateUI();
  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
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
  render();
});

updateUI();
render();
