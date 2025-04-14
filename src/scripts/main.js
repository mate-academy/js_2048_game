'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const score = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

function updateField() {
  const field = game.getState();
  const fieldRows = document.querySelectorAll('.field-row');

  fieldRows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, cellIndex) => {
      const value = field[rowIndex][cellIndex];

      cell.setAttribute('class', 'field-cell');
      cell.textContent = '';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
    });
  });

  score.textContent = game.getScore();
  updateGameMessages();
}

function updateGameMessages() {
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');

  switch (game.getStatus()) {
    case Game.gameStatus.win:
      messageWin.classList.remove('hidden');
      break;
    case Game.gameStatus.lose:
      messageLose.classList.remove('hidden');
      break;
    case Game.gameStatus.idle:
      messageStart.classList.remove('hidden');
      break;
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === Game.gameStatus.playing) {
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

    updateField();
  }
});

startButton.addEventListener('click', () => {
  if (game.getStatus() === Game.gameStatus.idle) {
    game.start();
    startButton.textContent = 'Restart';
    startButton.classList.replace('start', 'restart');
  } else {
    game.restart();
    startButton.textContent = 'Start';
    startButton.classList.replace('restart', 'start');
  }

  updateField();
});
