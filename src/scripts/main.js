'use strict';

import Game from '../modules/Game.class.js';

const checkDirection = (evt, direction) => evt.key === direction;

function game2048() {
  const game = new Game();
  const button = document.querySelector('.button');

  document.addEventListener('keydown', (evt) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    if (checkDirection(evt, 'ArrowLeft')) {
      moved = game.moveLeft();
    }

    if (checkDirection(evt, 'ArrowRight')) {
      moved = game.moveRight();
    }

    if (checkDirection(evt, 'ArrowUp')) {
      moved = game.moveUp();
    }

    if (checkDirection(evt, 'ArrowDown')) {
      // eslint-disable-next-line no-unused-vars
      moved = game.moveDown();
    }

    updateUI();
  });

  const updateBoard = () => {
    const board = game.getState();
    const cells = document.querySelectorAll('.field-cell');

    for (let cell = 0; cell < 16; cell++) {
      const row = Math.floor(cell / 4);
      const column = cell % 4;
      const value = board[row][column];

      cells[cell].textContent = value || '';
      cells[cell].className = 'field-cell';

      if (value) {
        cells[cell].classList.add(`field-cell--${value}`);
      }
    }
  };

  const updateScore = () => {
    const score = document.querySelector('.game-score');

    score.textContent = game.getScore();
  };

  const updateStatus = () => {
    if (game.getStatus() === 'idle') {
      button.classList.add('start');
      button.classList.remove('restart');
      button.textContent = 'Start';
    } else {
      button.classList.add('restart');
      button.classList.remove('start');
      button.textContent = 'Restart';
    }
  };

  const updateMessage = () => {
    const state = game.getStatus();

    const messageStart = document.querySelector('.message.message-start');
    const messageWin = document.querySelector('.message.message-win');
    const messageLose = document.querySelector('.message.message-lose');

    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');

    if (state === 'win') {
      messageWin.classList.remove('hidden');
    } else if (state === 'lose') {
      messageLose.classList.remove('hidden');
    }
  };

  const updateUI = () => {
    updateBoard();
    updateScore();
    updateStatus();
    updateMessage();
  };

  button.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
      game.start();
    } else {
      game.restart();
    }

    updateUI();
  });

  updateUI();
}

document.addEventListener('DOMContentLoaded', game2048);
