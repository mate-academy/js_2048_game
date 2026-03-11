'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const cells = document.querySelectorAll('.field-cell');

function render() {
  const board = game.getState();

  board.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');

  startButton.textContent = gameStatus === 'idle' ? 'Start' : 'Restart';

  startButton.className =
    gameStatus === 'idle' ? 'button start' : 'button restart';

  if (gameStatus === 'win' || gameStatus === 'lose') {
    enableScroll();
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    disableScroll();
  } else {
    game.restart();
    game.start();
    disableScroll();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  const key = e.key;
  const gameStatus = game.getStatus();

  if (gameStatus !== 'playing') {
    return;
  }

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
    switch (key) {
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

    render();
  }
});

// Touch controls for mobile screen
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener(
  'touchstart',
  (e) => {
    const touch = e.changedTouches[0];

    touchStartX = touch.screenX;
    touchStartY = touch.screenY;

    if (e.target.closest('.field')) {
      e.preventDefault();
    }
  },
  { passive: false },
);

document.addEventListener('touchend', (e) => {
  const touch = e.changedTouches[0];
  const dx = touch.screenX - touchStartX;
  const dy = touch.screenY - touchStartY;

  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (absDx < 30 && absDy < 30) {
    return;
  }

  const gameStatus = game.getStatus();

  if (gameStatus !== 'playing') {
    return;
  }

  if (absDx > absDy) {
    if (dx > 0) {
      game.moveRight();
    } else {
      game.moveLeft();
    }
  } else {
    if (dy > 0) {
      game.moveDown();
    } else {
      game.moveUp();
    }
  }

  render();
});

function disableScroll() {
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
}

function enableScroll() {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}
