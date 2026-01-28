'use strict';

const tbody = document.querySelector('.game-field');
const Game = require('../modules/Game.class.js');

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const start = document.querySelector('.start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');
  const messageStart = document.querySelector('.message.message-start');

  start.addEventListener('click', () => {
    switch (game.getStatus()) {
      case 'idle': {
        start.classList.remove('start');
        start.classList.add('restart');
        start.textContent = 'Restart';
        messageStart.classList.add('hidden');
        winMessage.classList.add('hidden');
        loseMessage.classList.add('hidden');
        game.start();
        break;
      }
      case 'playing':
      // falls through
      case 'win':

      // falls through
      case 'lose': {
        start.classList.remove('restart');
        start.classList.add('start');
        start.textContent = 'Start';
        messageStart.classList.remove('hidden');
        winMessage.classList.add('hidden');
        loseMessage.classList.add('hidden');
        game.restart();
        break;
      }
      default:
        break;
    }
    renderBoard(game.getState());
    renderScore(game.getScore());
    renderStatus(game.getStatus());
  });

  document.addEventListener('keydown', (b) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    switch (b.key) {
      case 'ArrowLeft':
        moved = game.handleMove('left');
        break;
      case 'ArrowRight':
        moved = game.handleMove('right');
        break;
      case 'ArrowUp':
        moved = game.handleMove('up');
        break;
      case 'ArrowDown':
        moved = game.handleMove('down');
        break;
    }

    if (!moved) {
      return;
    }

    const gameStatus = game.getStatus();
    const state = game.getState();
    const score = game.getScore();

    renderBoard(state);
    renderScore(score);
    renderStatus(gameStatus);
  });
});

function renderScore(score) {
  const s = document.querySelector('.game-score');

  s.textContent = score;
}

function renderBoard(state) {
  const rows = Array.from(tbody.querySelectorAll('.field-row'));

  state.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      const cell = rows[rowIndex].cells[colIndex];

      cell.textContent = '';

      cell.classList.forEach((cls) => {
        if (cls.startsWith('field-cell--')) {
          cell.classList.remove(cls);
        }
      });

      if (cellValue !== 0) {
        cell.textContent = cellValue;
        cell.classList.add(`field-cell--${cellValue}`);
      }
    });
  });
}

function renderStatus(gameStatus) {
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const messageStart = document.querySelector('.message-start');

  switch (gameStatus) {
    case 'idle':
      messageStart.classList.remove('hidden');
      break;
    case 'lose':
      messageLose.classList.remove('hidden');
      break;
    case 'win':
      messageWin.classList.remove('hidden');
      break;
  }
}
