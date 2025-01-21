'use strict';

import Game from '../modules/Game.class';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const startButton = document.querySelector('.button.start');
  const scoreDisplay = document.querySelector('.game-score');
  const fieldCells = document.querySelectorAll('.field-cell');
  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');

  const updateUI = () => {
    const state = game.getState();

    fieldCells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = state[row][col];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
    });

    scoreDisplay.textContent = game.getScore();

    // eslint-disable-next-line no-shadow
    const status = game.getStatus();

    messageStart.classList.toggle('hidden', status !== 'not_started');
    messageWin.classList.toggle('hidden', status !== 'won');
    messageLose.classList.toggle('hidden', status !== 'game_over');

    startButton.textContent = status === 'playing' ? 'Restart' : 'Start';
  };

  const startGame = () => {
    game.start();
    updateUI();
  };

  const handleMove = (direction) => {
    if (game.getStatus() === 'playing') {
      switch (direction) {
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
  };

  startButton.addEventListener('click', startGame);

  // eslint-disable-next-line no-shadow
  document.addEventListener('keydown', (event) => {
    handleMove(event.key);
  });

  updateUI();
});
