'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

// DOM
const startBtn = document.querySelector('.button.start');
const scoreEl = document.querySelector('.game-score');

const field = document.querySelector('.game-field');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

// ---------- RENDER ----------
function render() {
  const state = game.getState();

  scoreEl.textContent = game.getScore();

  const rows = field.querySelectorAll('tr');

  state.forEach((row, rowIndex) => {
    const cells = rows[rowIndex].querySelectorAll('td');

    row.forEach((value, colIndex) => {
      const cell = cells[colIndex];

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
    });
  });

  updateMessages();
}

// ---------- MESSAGES ----------
function updateMessages() {
  const gameStatus = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  }

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

// ---------- KEYBOARD ----------
document.addEventListener('keydown', (ev) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (ev.key) {
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
});

// ---------- START / RESTART ----------
startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
  startBtn.textContent = 'Restart';

  render();
});

// initial render
render();
