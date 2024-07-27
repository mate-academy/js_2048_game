'use strict';

import Game from '../modules/Game.class';

const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const scoreBoard = document.querySelector('.game-score');
  const startButton = document.querySelector('.start');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const messageStart = document.querySelector('.message-start');

  const renderBoard = () => {
    const state = game.getState();
    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;

      cell.textContent = state[row][col] === 0 ? '' : state[row][col];
      cell.className = `field-cell field-cell--${state[row][col]}`;
    });
    scoreBoard.textContent = game.getScore();
  };

  const handleMove = (direction) => {
    let moved = false;

    switch (direction) {
      case 'left':
        moved = game.moveLeft();
        break;
      case 'right':
        moved = game.moveRight();
        break;
      case 'up':
        moved = game.moveUp();
        break;
      case 'down':
        moved = game.moveDown();
        break;
    }

    if (moved) {
      renderBoard();
    }

    const gameStatus = game.getStatus();

    if (gameStatus === 'win') {
      messageWin.classList.remove('hidden');
    } else if (gameStatus === 'lose') {
      messageLose.classList.remove('hidden');
    }
  };

  document.addEventListener('keydown', (evt) => {
    switch (evt.key) {
      case 'ArrowLeft':
        handleMove('left');
        break;
      case 'ArrowRight':
        handleMove('right');
        break;
      case 'ArrowUp':
        handleMove('up');
        break;
      case 'ArrowDown':
        handleMove('down');
        break;
    }
  });

  startButton.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
      game.start();
      startButton.textContent = 'Restart';
      messageStart.classList.add('hidden');
      messageLose.classList.add('hidden');
      messageWin.classList.add('hidden');
    } else {
      game.restart();
      startButton.textContent = 'Start';
      messageStart.classList.remove('hidden');
      messageLose.classList.add('hidden');
      messageWin.classList.add('hidden');
    }
    renderBoard();
  });

  renderBoard();
});
