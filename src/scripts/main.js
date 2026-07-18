'use strict';

import { Game } from '../modules/Game.class.js';

const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  let isGameStarted = false;

  const scoreDisplay = document.querySelector('.game-score');
  const mainButton = document.querySelector('.button');
  const cells = document.querySelectorAll('.field-cell');

  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');

  function updateUI() {
    const board = game.getState();

    scoreDisplay.textContent = game.getScore();

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = board[row][col];

      cell.textContent = value > 0 ? value : '';

      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });

    const gameStatus = game.getStatus();

    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');

    if (status === 'win') {
      messageWin.classList.remove('hidden');
    } else if (gameStatus === 'lose') {
      messageLose.classList.remove('hidden');
    }
  }

  mainButton.addEventListener('click', () => {
    if (!isGameStarted) {
      game.start();
      isGameStarted = true;
      messageStart.classList.add('hidden');

      mainButton.textContent = 'Restart';
      mainButton.classList.remove('start');
      mainButton.classList.add('restart');
    } else {
      game.restart();
    }
    updateUI();
  });

  document.addEventListener('keydown', (pointerEvent) => {
    if (!isGameStarted || game.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    switch (pointerEvent.key) {
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

    pointerEvent.preventDefault();

    if (moved) {
      updateUI();
    }
  });

  updateUI();
});
