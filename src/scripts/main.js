'use strict';

const Game = require('../modules/Game.class');

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  const gameField = document.querySelector('.game-field');
  const gameScore = document.querySelector('.game-score');
  const gameButton = document.querySelector('.button.start');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const messageStart = document.querySelector('.message-start');

  function updateField() {
    const currentState = game.getState();
    const fieldRows = gameField.querySelectorAll('.field-row');

    for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
      const fieldCells = fieldRows[rowIdx].querySelectorAll('.field-cell');

      for (let colIdx = 0; colIdx < 4; colIdx++) {
        const cellValue = currentState[rowIdx][colIdx];

        fieldCells[colIdx].textContent = cellValue === 0 ? '' : cellValue;

        fieldCells[colIdx].className =
          cellValue === 0
            ? 'field-cell'
            : `field-cell field-cell--${cellValue}`;
      }
    }
  }

  function updateScore() {
    const currentScore = game.getScore();

    gameScore.textContent = currentScore;
  }

  function updateButton() {
    const currentStatus = game.getStatus();

    if (currentStatus === 'idle') {
      gameButton.textContent = 'Start';
      gameButton.className = 'button start';
    } else {
      gameButton.textContent = 'Restart';
      gameButton.className = 'button restart';
    }
  }

  function updateMessages() {
    const currentStatus = game.getStatus();

    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');

    if (currentStatus === 'idle') {
      messageStart.classList.remove('hidden');
    } else if (currentStatus === 'lose') {
      messageLose.classList.remove('hidden');
    } else if (currentStatus === 'win') {
      messageWin.classList.remove('hidden');
    }
  }

  function refreshUI() {
    updateField();
    updateScore();
    updateButton();
    updateMessages();
  }

  gameButton.addEventListener('click', (ev) => {
    const currentStatus = game.getStatus();

    ev.target.blur(); // знімає фокус
    window.focus(); // повертає фокус на документ

    if (currentStatus === 'idle') {
      game.start();
    } else {
      game.restart();
    }

    refreshUI();
  });

  document.addEventListener('keydown', (ev) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    switch (ev.key) {
      case 'ArrowLeft':
        ev.preventDefault();
        game.moveLeft();
        break;
      case 'ArrowRight':
        ev.preventDefault();
        game.moveRight();
        break;
      case 'ArrowUp':
        ev.preventDefault();
        game.moveUp();
        break;
      case 'ArrowDown':
        ev.preventDefault();
        game.moveDown();
        break;
      default:
        return;
    }

    refreshUI(); // завжди оновлюємо
  });

  refreshUI();
});
