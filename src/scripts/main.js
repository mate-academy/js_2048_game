'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameScoreElement = document.querySelector('.game-score');
const startBtn = document.querySelector('.button');
const rows = document.querySelectorAll('.game-field .field-row');
const messageStartElement = document.querySelector('.message-start');
const messageWinElement = document.querySelector('.message-win');
const messageLoseElement = document.querySelector('.message-lose');

const gameElements = [...rows].map((row) => {
  return row.querySelectorAll('.field-cell');
});

startBtn.addEventListener('click', () => {
  if (game.getStatus() === Game.STATUSES.IDLE) {
    game.start();
    startBtn.textContent = 'Restart';
  } else {
    clearBoard();
    gameScoreElement.textContent = 0;

    game.restart();
  }

  if (startBtn.classList.contains('start')) {
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  }

  if (!messageStartElement.classList.contains('hidden')) {
    messageStartElement.classList.add('hidden');
  }

  if (!messageWinElement.classList.contains('hidden')) {
    messageWinElement.classList.add('hidden');
  }

  if (!messageLoseElement.classList.contains('hidden')) {
    messageLoseElement.classList.add('hidden');
  }

  setValuesOnBoard();
});

function clearBoard() {
  gameElements.forEach((row) => {
    row.forEach((cell) => {
      cell.textContent = '';
      cell.className = 'field-cell';
    });
  });
}

function setValuesOnBoard() {
  gameElements.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const value = game.getState()[rowIndex][columnIndex];

      if (value === 0) {
        return;
      }

      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    });
  });
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === Game.STATUSES.PLAYING) {
    if (e.key === 'ArrowLeft') {
      game.moveLeft();
    } else if (e.key === 'ArrowRight') {
      game.moveRight();
    } else if (e.key === 'ArrowUp') {
      game.moveUp();
    } else if (e.key === 'ArrowDown') {
      game.moveDown();
    }

    if (
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
    ) {
      clearBoard();
      setValuesOnBoard();

      gameScoreElement.textContent = game.getScore();
    }
  }

  if (game.getStatus() === Game.STATUSES.WIN) {
    messageWinElement.classList.remove('hidden');
  }

  if (game.getStatus() === Game.STATUSES.LOSE) {
    messageLoseElement.classList.remove('hidden');
  }
});
