'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code hereimport Game from '../modules/Game.class.js';
import { Game } from '../modules/Game.class.js';

const game = new Game();

function updateUI() {
  const board = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  const scoreElement = document.querySelector('.game-score');
  const cells = document.querySelectorAll('.field-cell');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  if (scoreElement) {
    scoreElement.textContent = score;
  }

  if (cells) {
    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = board[row][col];

      cell.textContent = value || '';
      cell.className = `field-cell${value ? ` field-cell--${value}` : ''}`;
    });
  }

  if (winMessage && loseMessage) {
    if (gameStatus === 'won') {
      winMessage.classList.remove('hidden');
      loseMessage.classList.add('hidden');
    } else if (gameStatus === 'lost') {
      loseMessage.classList.remove('hidden');
      winMessage.classList.add('hidden');
    } else {
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
    }
  }
}

document.querySelector('.button.start').addEventListener('click', (e) => {
  const button = e.target;
  const messageStart = document.querySelector('.message-start');

  if (game.getStatus() === 'ready' || game.getStatus() === 'lost') {
    game.start();
    updateUI();
    button.classList.add('restart');
    button.textContent = 'Restart';

    if (messageStart) {
      messageStart.classList.add('hidden');
    }
  } else {
    game.restart();
    updateUI();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'in_progress') {
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
});

updateUI();
