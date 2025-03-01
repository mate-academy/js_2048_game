'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  function updateButton() {
    const button = document.querySelector('.button');

    if (game.status === 'idle') {
      button.classList.remove('restart');
      button.classList.add('start');
      button.textContent = 'Start';
    } else {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
    }
  }

  function updateMessage() {
    switch (game.status) {
      case 'idle':
        document.querySelector('.message-start').classList.remove('hidden');
        document.querySelector('.message-win').classList.add('hidden');
        document.querySelector('.message-lose').classList.add('hidden');
        break;
      case 'playing':
        document.querySelector('.message-start').classList.add('hidden');
        break;
      case 'win':
        document.querySelector('.message-win').classList.remove('hidden');
        break;
      case 'lose':
        document.querySelector('.message-lose').classList.remove('hidden');
        break;
      default:
        break;
    }

    updateButton();
  }

  function getScore() {
    document.querySelector('.game-score').textContent = game.score;
  }

  function updateBoard() {
    const cells = document.querySelectorAll('.field-cell');
    let index = 0;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = cells[index];

        cell.textContent = game.board[row][col] || '';
        cell.className = `field-cell field-cell--${game.board[row][col]}`;
        index++;
      }
    }
  }

  document.querySelector('.button').addEventListener('click', () => {
    if (game.status === 'idle') {
      game.start();
    } else {
      game.restart();
    }

    updateMessage();
    getScore();
    updateBoard();
  });

  document.addEventListener('keydown', (e) => {
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

    updateMessage();
    getScore();
    updateBoard();
  });
});
