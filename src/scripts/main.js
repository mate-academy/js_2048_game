'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const scoreResult = document.querySelector('.game-score');
  const startButton = document.querySelector('.start');
  const gameRows = document.querySelectorAll('.field-row');

  function removeNumberClasses(cell) {
    const classes = Array.from(cell.classList);

    classes.forEach((className) => {
      if (/^field-cell--\d+$/.test(className)) {
        cell.classList.remove(className);
      }
    });
  }

  function showGameResult(currentStatus) {
    if (currentStatus === 'win' || currentStatus === 'lose') {
      const message = document.querySelector(`.message-${currentStatus}`);

      if (message) {
        message.classList.remove('hidden');
      }
    }
  }

  function hideMessages() {
    const messages = ['start', 'win', 'lose'];

    messages.forEach((type) => {
      const message = document.querySelector(`.message-${type}`);

      if (message) {
        message.classList.add('hidden');
      }
    });
  }

  function updateGrid() {
    const state = game.getState();

    for (let rowIndex = 0; rowIndex < state.length; rowIndex++) {
      const cells = gameRows[rowIndex].querySelectorAll('.field-cell');

      for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
        const cellValue = state[rowIndex][cellIndex];
        const cell = cells[cellIndex];

        removeNumberClasses(cell);

        if (cellValue !== 0) {
          cell.classList.add(`field-cell--${cellValue}`);
          cell.textContent = `${cellValue}`;
        } else {
          cell.textContent = '';
        }
      }
    }

    scoreResult.textContent = game.getScore();
  }

  function resetGame() {
    game.restart();
    hideMessages();
    updateGrid();

    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';

    const messageStart = document.querySelector('.message-start');

    if (messageStart) {
      messageStart.classList.remove('hidden');
    }
  }

  function startGame() {
    game.start();
    hideMessages();
    updateGrid();

    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  }

  startButton.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
      startGame();
    } else {
      resetGame();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();

      if (game.getStatus() !== 'playing') {
        return;
      }

      const previousState = JSON.stringify(game.getState());
      const previousScore = game.getScore();

      switch (e.key) {
        case 'ArrowUp':
          game.moveUp();
          break;
        case 'ArrowDown':
          game.moveDown();
          break;
        case 'ArrowLeft':
          game.moveLeft();
          break;
        case 'ArrowRight':
          game.moveRight();
          break;
      }

      const currentState = JSON.stringify(game.getState());
      const currentScore = game.getScore();

      if (previousState !== currentState || previousScore !== currentScore) {
        updateGrid();
        showGameResult(game.getStatus());
      }
    }
  });

  updateGrid();
});
