'use strict';

const Game = require('../modules/Game.class');
const { GAME_STATUS, showElement, hideElement } = require('../modules/util');

const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  function updateButton() {
    const button = document.querySelector('.button');

    if (game.status === GAME_STATUS.idle) {
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
      case GAME_STATUS.idle:
        showElement('.message-start');
        hideElement('.message-win');
        hideElement('.message-lose');

        break;
      case GAME_STATUS.playing:
        hideElement('.message-start');
        break;

      case GAME_STATUS.win:
        showElement('.message-win');
        break;

      case GAME_STATUS.lose:
        showElement('.message-lose');
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
    if (game.status === GAME_STATUS.idle) {
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
