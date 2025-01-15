'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameField = document.querySelector('.game-field');

function renderBoard(board) {
  const cells = Array.from(gameField.querySelectorAll('.field-cell'));

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value !== 0 ? value : '';
    cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
  });
}

function updateGameState() {
  scoreElement.textContent = game.getScore();
  renderBoard(game.getState());

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
  }
}

startButton.addEventListener('click', () => {
  game.restart();
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
  updateGameState();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
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
    }
    updateGameState();
  }
});
