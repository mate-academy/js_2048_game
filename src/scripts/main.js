'use strict';

import Game from '../modules/Game.class.js';

let game;

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.button.start');
  const restartButton = document.querySelector('.button.restart');
  const gameField = document.querySelector('.game-field');
  const gameScore = document.querySelector('.game-score');
  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');

  function initializeGame() {
    game = new Game();
    updateUI();
    startButton.classList.remove('hidden');
    restartButton.classList.add('hidden');
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }

  function updateUI() {
    gameScore.textContent = game.getScore();

    const boardState = game.getState();
    const cells = gameField.getElementsByClassName('field-cell');
    let index = 0;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cell = cells[index];
        const value = boardState[r][c];

        cell.className = `field-cell field-cell--${value || 'empty'}`;

        cell.textContent = value || '';
        index++;
      }
    }

    if (game.getStatus() === 'won') {
      messageWin.classList.remove('hidden');
      messageLose.classList.add('hidden');
    } else if (game.getStatus() === 'lost') {
      messageLose.classList.remove('hidden');
      messageWin.classList.add('hidden');
    } else {
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');
    }
  }

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
        default:
          return;
      }
      updateUI();
    }
  });

  startButton.addEventListener('click', () => {
    game.start();
    updateUI();
    startButton.classList.add('hidden');
    restartButton.classList.remove('hidden');
    messageStart.classList.add('hidden');
  });

  restartButton.addEventListener('click', () => {
    initializeGame();
    game.restart();
    updateUI();
  });

  initializeGame();
});
