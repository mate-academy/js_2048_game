'use strict';

import Game from '../modules/Game.class.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  const gameField = document.querySelector('.game-field');
  const cells = gameField.querySelectorAll('.field-cell');
  const scoreElement = document.querySelector('.game-score');
  const startButton = document.querySelector('.button');
  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');

  function updateUI() {
    const state = game.getState();
    const gameStatus = game.getStatus();

    let cellIndex = 0;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const value = state[i][j];
        const cell = cells[cellIndex];

        cell.className = 'field-cell';

        if (value > 0) {
          cell.classList.add(`field-cell--${value}`);
          cell.textContent = value;
        } else {
          cell.textContent = '';
        }

        cellIndex++;
      }
    }

    scoreElement.textContent = game.getScore();

    if (gameStatus === 'lose') {
      scoreElement.classList.add('game-score--lose');
      startButton.classList.add('show-hand');
    } else {
      scoreElement.classList.remove('game-score--lose');
      startButton.classList.remove('show-hand');
    }

    messageStart.classList.toggle('hidden', gameStatus !== 'idle');
    messageWin.classList.toggle('hidden', gameStatus !== 'win');
    messageLose.classList.toggle('hidden', gameStatus !== 'lose');

    if (gameStatus === 'idle') {
      startButton.textContent = 'Start';
      startButton.classList.remove('restart');
      startButton.classList.add('start');
    } else {
      startButton.textContent = 'Restart';
      startButton.classList.remove('start');
      startButton.classList.add('restart');
    }
  }

  const handleKeyPress = (e) => {
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
  };

  document.addEventListener('keydown', handleKeyPress);

  const handleGameStartOrRestart = () => {
    if (game.getStatus() === 'idle') {
      game.start();
    } else {
      game.restart();
    }

    updateUI();
  };

  startButton.addEventListener('click', handleGameStartOrRestart);

  updateUI();
});
