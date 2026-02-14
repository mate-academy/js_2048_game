'use strict';

import { GAME_STATUS, MIN_SWIPE_DISTANCE } from '../constants/constants';
import '../styles/main.scss';
import Game from '../modules/Game.class';

const rows = document.querySelectorAll('.field-row');
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const gameContainer = document.querySelector('.container');

const game = new Game();
let touchStartX = 0;
let touchStartY = 0;

button.addEventListener('click', () => {
  if (game.status === GAME_STATUS.IDLE) {
    game.start();
  } else {
    game.restart();
  }

  render(game.state);
});

gameContainer.addEventListener('touchstart', (e) => {
  const touch = e.changedTouches[0];

  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

gameContainer.addEventListener('touchend', (e) => {
  if (game.status !== GAME_STATUS.PLAYING) {
    return;
  }

  const touch = e.changedTouches[0];
  const diffX = touch.clientX - touchStartX;
  const diffY = touch.clientY - touchStartY;

  const absX = Math.abs(diffX);
  const absY = Math.abs(diffY);

  if (absX < MIN_SWIPE_DISTANCE && absY < MIN_SWIPE_DISTANCE) {
    return;
  }

  if (absX > absY) {
    if (diffX > 0) {
      game.moveRight();
    } else {
      game.moveLeft();
    }
  } else {
    if (diffY > 0) {
      game.moveDown();
    } else {
      game.moveUp();
    }
  }

  render(game.state);
});

gameContainer.addEventListener('touchmove', (e) => e.preventDefault(), {
  passive: false,
});

document.addEventListener('keydown', (e) => {
  if (game.status !== GAME_STATUS.PLAYING) {
    return;
  }

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

  render(game.state);
});

function render(board) {
  button.classList.remove('start', 'restart');
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  switch (game.status) {
    case GAME_STATUS.IDLE:
      button.classList.add('start');
      button.textContent = 'Start';
      messageStart.classList.remove('hidden');
      break;

    case GAME_STATUS.PLAYING:
      button.classList.add('restart');
      button.textContent = 'Restart';
      break;

    case GAME_STATUS.WIN:
      button.classList.add('restart');
      button.textContent = 'Restart';
      messageWin.classList.remove('hidden');
      break;

    case GAME_STATUS.LOSE:
      button.classList.add('restart');
      button.textContent = 'Restart';
      messageLose.classList.remove('hidden');
      break;
  }

  score.textContent = game.score;

  rows.forEach((row, i) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, j) => {
      const value = board[i][j];

      cell.className = 'field-cell';
      cell.textContent = value === 0 ? '' : value;

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });
}
