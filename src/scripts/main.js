'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.button.start');
  const scoreElement = document.querySelector('.game-score');
  const fieldCells = document.querySelectorAll('.field-cell');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const messageStart = document.querySelector('.message-start');

  const updateUI = () => {
    const board = game.getState();
    const score = game.getScore();
    const statusUpdate = game.getStatus();

    fieldCells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = board[row][col];

      cell.textContent = value === 0 ? '' : value;
      cell.className = `field-cell ${value > 0 ? `field-cell--${value}` : ''}`;
    });

    scoreElement.textContent = score;

    messageLose.classList.toggle('hidden', statusUpdate !== 'lose');
    messageWin.classList.toggle('hidden', statusUpdate !== 'win');
    messageStart.classList.toggle('hidden', statusUpdate !== 'idle');
  };

  startButton.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
      startButton.textContent = 'Restart';
      game.start();
    } else {
      game.restart();
    }
    updateUI();
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
  });

  updateUI();
});
