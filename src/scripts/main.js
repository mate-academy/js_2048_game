'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.button.start');
  const gameField = document.querySelector('.game-field');
  const scoreElement = document.querySelector('.game-score');
  const startMessage = document.querySelector('.message-start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  const updateUI = () => {
    scoreElement.textContent = game.getScore();

    const state = game.getState();

    gameField.querySelectorAll('.field-row').forEach((row, rIndex) => {
      row.querySelectorAll('.field-cell').forEach((cell, cIndex) => {
        cell.className = 'field-cell';

        if (state[rIndex][cIndex] !== 0) {
          cell.classList.add(`field-cell--${state[rIndex][cIndex]}`);
          cell.textContent = state[rIndex][cIndex];
        } else {
          cell.textContent = '';
        }
      });
    });

    if (game.getStatus() === 'win') {
      winMessage.classList.remove('hidden');
    } else if (game.getStatus() === 'lose') {
      loseMessage.classList.remove('hidden');
    } else {
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
    }
  };

  const startGame = () => {
    game.start();
    startMessage.classList.add('hidden');
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    updateUI();
  };

  const restartGame = () => {
    game.restart();
    startMessage.classList.remove('hidden');
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    updateUI();
  };

  startButton.addEventListener('click', () => {
    if (game.getStatus() === 'idle' || game.getStatus() === 'lose') {
      startGame();
    } else {
      restartGame();
    }
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
      updateUI();
    }
  });

  updateUI();
});
