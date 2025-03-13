'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

let shouldRestart = false;

// Write your code here
document.addEventListener('DOMContentLoaded', () => {
  const boardElement = document.querySelector('.game-field');
  const scoreElement = document.querySelector('.game-score');
  const startButton = document.querySelector('.button');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const messageStart = document.querySelector('.message-start');

  const updateUI = () => {
    const board = game.getState();

    boardElement.innerHTML = '';

    document.querySelector('.game-score').textContent = game.score;

    if (shouldRestart) {
      startButton.classList.remove('start');
      startButton.classList.add('restart');
      startButton.textContent = 'Restart';
    } else {
      startButton.classList.remove('restart');
      startButton.classList.add('start');
      startButton.textContent = 'Start';
    }

    board.forEach((row) => {
      const rowElement = document.createElement('tr');

      rowElement.classList.add('field-row');

      row.forEach((cell) => {
        const cellElement = document.createElement('td');

        cellElement.classList.add('field-cell');
        cellElement.textContent = cell !== 0 ? cell : '';
        rowElement.appendChild(cellElement);
      });

      boardElement.appendChild(rowElement);
    });

    scoreElement.textContent = game.getScore();
  };

  const checkGameState = () => {
    const gameStatus = game.getStatus();

    if (gameStatus === 'win') {
      messageWin.classList.remove('hidden');
    } else if (gameStatus === 'lose') {
      messageLose.classList.remove('hidden');
    }
  };

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
    }

    updateUI();
    checkGameState();
  });

  startButton.addEventListener('click', () => {
    if (!shouldRestart) {
      shouldRestart = true;
      game.start();
    } else {
      game.restart();
    }

    startButton.blur();
    updateUI();
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
  });

  // game.start();
  updateUI();
});
