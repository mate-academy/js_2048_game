'use strict';

const {
  STATUS_WIN,
  STATUS_LOSE,
  STATUS_PLAYING,
} = require('../modules/constants');

const Game = require('../modules/Game.class');

const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.button.start');
  const startMessage = document.querySelector('.message-start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');
  const gameScore = document.querySelector('.game-score');

  function updateDom(newState, newScore, newStatus) {
    newState.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        const cell = document.getElementById(`cell-${rowIndex}-${colIndex}`);

        if (cellValue) {
          cell.textContent = cellValue;
          cell.className = `field-cell field-cell--${cellValue}`;
        } else {
          cell.textContent = '';
          cell.className = `field-cell`;
        }
      });

      if (newStatus === STATUS_PLAYING) {
        winMessage.classList.add('hidden');
        loseMessage.classList.add('hidden');
      }

      if (newStatus === STATUS_WIN) {
        winMessage.classList.remove('hidden');
      }

      if (newStatus === STATUS_LOSE) {
        loseMessage.classList.remove('hidden');
      }
    });

    gameScore.textContent = String(newScore);
  }

  startButton.addEventListener('click', () => {
    game.start();
    updateDom(game.getState(), game.getScore(), game.getStatus());

    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');

    startMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  });

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
        game.moveUp();
        break;

      case 'ArrowDown':
        game.moveDown();
        break;

      case 'ArrowRight':
        game.moveRight();
        break;

      case 'ArrowLeft':
        game.moveLeft();
        break;

      default:
        break;
    }

    updateDom(game.getState(), game.getScore(), game.getStatus());
  });
});
