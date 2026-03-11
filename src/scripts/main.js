'use strict';

const Game = require('../modules/Game.class');

const button = document.querySelector('.button');
const scoreEl = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cellEls = [...document.querySelectorAll('.field-cell')];

const game = new Game();

function tileClass(value) {
  return value ? `field-cell--${value}` : '';
}

function renderBoard() {
  const state = game.getState();

  state.forEach((row, r) => {
    row.forEach((value, c) => {
      const cell = cellEls[r * 4 + c];

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(tileClass(value));
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
    });
  });
}

function renderScore() {
  const score = game.getScore();

  scoreEl.textContent = String(score);
}

function renderMessages() {
  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}

function renderButton() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
  } else {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }
}

function render() {
  renderBoard();
  renderScore();
  renderMessages();
  renderButton();
}

button.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  render();
});

const ARROW_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

document.addEventListener('keydown', (keyboardEvent) => {
  if (!ARROW_KEYS.includes(keyboardEvent.key)) {
    return;
  }

  keyboardEvent.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (keyboardEvent.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
  }

  if (moved) {
    render();
  }
});

let touchStartX = null;
let touchStartY = null;

document.addEventListener(
  'touchstart',
  (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  },
  { passive: true },
);

document.addEventListener(
  'touchend',
  (e) => {
    if (touchStartX === null || game.getStatus() !== 'playing') {
      return;
    }

    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    touchStartX = null;
    touchStartY = null;

    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
      return;
    }

    let moved = false;

    if (Math.abs(dx) > Math.abs(dy)) {
      moved = dx > 0 ? game.moveRight() : game.moveLeft();
    } else {
      moved = dy > 0 ? game.moveDown() : game.moveUp();
    }

    if (moved) {
      render();
    }
  },
  { passive: true },
);

render();
