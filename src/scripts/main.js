'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameField = document.querySelector('.game-field');
const rows = document.querySelectorAll('.field-row');
const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateUI() {
  const boardState = game.getState();

  let cellIndex = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cellValue = boardState[row][col];
      const cell = cells[cellIndex];

      cell.className = 'field-cell';

      if (cellValue !== 0) {
        cell.textContent = cellValue;
        cell.classList.add(`field-cell--${cellValue}`);
      } else {
        cell.textContent = '';
      }

      cellIndex++;
    }
  }

  scoreElement.textContent = game.getScore();

  handleGameStatus();
}

function handleGameStatus() {
  const gameStatus = game.getStatus();

  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  // Show start message when not playing
  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (gameStatus !== 'idle') {
    startButton.className = 'button restart';
    startButton.textContent = 'Restart';
  } else {
    startButton.className = 'button start';
    startButton.textContent = 'Start';
  }
}

startButton.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  updateUI();
});

document.addEventListener('keydown', (e) => {
  const gameStatus = game.getStatus();
  console.log(e.key);

  if (gameStatus === 'playing' || gameStatus === 'win') {
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
  }
});

function initGame() {
  updateUI();
}

document.addEventListener('DOMContentLoaded', initGame);
