'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const Game = require('../modules/Game.class');
  const game = new Game();
  const startRestartButton = document.querySelector('.button');
  let isFirstMove = true;
  const gStatus = () => game.getStatus();
  const gState = () => game.getState();
  const gScore = () => game.getScore();
  const gMaxCell = () => game.gMaxCell();
  const gIsAvailableMovement = () => game.getMoveAvailability();
  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const gameScore = document.querySelector('.game-score');

  // #region create game field cells array
  const rows = document.querySelectorAll('.field-row');
  const gameFieldCells = [];

  rows.forEach((row) => {
    gameFieldCells.push(row.querySelectorAll('.field-cell'));
  });
  // #endregion

  // #region clear game field
  const resetGame = () => {
    game.restart();
    refreshGameField();
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  };
  // #endregion

  // #region change start/restart button text and class
  const changeButtonStartToRestart = () => {
    startRestartButton.classList.remove('start');
    startRestartButton.classList.add('restart');
    startRestartButton.textContent = 'Restart';
    isFirstMove = false;
  };

  const changeButtonRestartToStart = () => {
    startRestartButton.classList.remove('restart');
    startRestartButton.classList.add('start');
    startRestartButton.textContent = 'Start';
  };

  // #endregion

  // #region refreshGameField

  const refreshGameField = () => {
    const field = gState();
    const maxCell = gMaxCell();
    const isAvailableMovement = gIsAvailableMovement();

    gameScore.textContent = gScore();

    for (let i = 0; i < gameFieldCells.length; i++) {
      const row = gameFieldCells[i];

      for (let k = 0; k < row.length; k++) {
        const value = field[i][k];
        const cell = row[k];

        cell.textContent = '';
        cell.className = 'field-cell';

        if (value) {
          cell.textContent = value;
          cell.className = `field-cell field-cell--${value}`;
        }
      }
    }

    if (maxCell === 2048) {
      document.removeEventListener('keydown', kbListener);

      messageWin.classList.remove('hidden');
    }

    if (!isAvailableMovement) {
      document.removeEventListener('keydown', kbListener);
      messageLose.classList.remove('hidden');
    }
  };

  // #endregion

  // #region keyboardListener

  const kbListener = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        game.moveLeft();
        refreshGameField();

        if (gStatus() === 'playing') {
          changeButtonStartToRestart();
        }

        break;
      case 'ArrowRight':
        game.moveRight();
        refreshGameField();

        if (gStatus() === 'playing') {
          changeButtonStartToRestart();
        }

        break;
      case 'ArrowUp':
        game.moveUp();
        refreshGameField();

        if (gStatus() === 'playing') {
          changeButtonStartToRestart();
        }

        break;
      case 'ArrowDown':
        game.moveDown();
        refreshGameField();

        if (gStatus() === 'playing') {
          changeButtonStartToRestart();
        }

        break;
      default:
        break;
    }
  };

  // #endregion

  startRestartButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (gStatus() === 'playing' && !isFirstMove) {
      resetGame();
      changeButtonRestartToStart();
      document.addEventListener('keydown', kbListener);
    }

    if (gStatus() === 'idle' && isFirstMove) {
      game.start();

      e.currentTarget.blur();

      messageStart.classList.add('hidden');

      refreshGameField();
      document.addEventListener('keydown', kbListener);
    }
  });
});
