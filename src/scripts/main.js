'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.start');
const score = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

button.addEventListener('click', (e) => {
  if (button.classList.contains('start')) {
    game.start();
    renderGameBoard();

    messageStart.classList.add('hidden');
    button.classList.remove('start');
    button.textContent = 'Restart';
    button.classList.add('restart');
  } else {
    game.restart();
    renderGameBoard();

    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    button.classList.remove('restart');
    button.textContent = 'Start';
    button.classList.add('start');
  }
});

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyA':
    case 'ArrowLeft':
      game.moveLeft();
      renderGameBoard();
      checkGameOver();
      break;

    case 'KeyW':
    case 'ArrowUp':
      game.moveUp();
      renderGameBoard();
      checkGameOver();
      break;

    case 'KeyD':
    case 'ArrowRight':
      game.moveRight();
      renderGameBoard();
      checkGameOver();
      break;

    case 'KeyS':
    case 'ArrowDown':
      game.moveDown();
      renderGameBoard();
      checkGameOver();
      break;

    default:
      break;
  }
});

function renderGameBoard() {
  const state = game.getState();
  const rows = document.querySelectorAll('.field-row');

  score.textContent = '';
  score.textContent = game.getScore();

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, cellIndex) => {
      const value = state[rowIndex][cellIndex];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });
}

function checkGameOver() {
  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }
}
