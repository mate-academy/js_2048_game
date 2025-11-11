'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();
import { Game } from '../modules/Game.class.js';

const game = new Game();

const mainButton = document.getElementById('main-button');
const scoreDisplay = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');

mainButton.addEventListener('click', () => {
  if (game.getStatus() === 'menu') {
    game.start();
    mainButton.textContent = 'Restart';
    messageStart.classList.add('hidden');
    updateUI();
  } else {
    game.restart();
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    updateUI();
  }
});

function updateUI() {
  scoreDisplay.textContent = game.getScore();

  const stat = game.getStatus();

  if (stat === 'playing') {
    document.body.baxkgroundColor = '#faf8ef';
  } else if (stat === 'menu') {
    document.body.backgroundColor = '#ccc';
  }
}

document.addEventListener('keydown', (ev) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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

  updateBoard();
});

function updateBoard() {
  const state = game.getState();

  cells.forEach((cell) => {
    cell.textContent = '';
    cell.className = 'field-cell';
  });

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = state.board[row][col];

      if (value !== 0) {
        const index = row * 4 + col;
        const cell = cells[index];

        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  scoreDisplay.textContent = game.getScore();

  if (state.status === 'win') {
    messageWin.classList.remove('hidden');
  } else if (state.status === 'lose') {
    messageLose.classList.remove('hidden');
  }
}
