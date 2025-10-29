'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const button = document.querySelector('.button.start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const gameScore = document.querySelector('.game-score');
const table = document.querySelector('.game-field tbody');
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  touchEndY = e.changedTouches[0].clientY;
  handleSwipe();
});

document.addEventListener('keydown', (e) => {
  handleMove(e.key);
});

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    showRestartButton();
    game.start();
  } else {
    game.restart();
  }
  renderBoard();
});

function handleSwipe() {
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
    return;
  }

  let direction = '';

  if (Math.abs(dx) > Math.abs(dy)) {
    direction = dx > 0 ? 'ArrowRight' : 'ArrowLeft';
  } else {
    direction = dy > 0 ? 'ArrowDown' : 'ArrowUp';
  }
  handleMove(direction);
}

function handleMove(direction) {
  let directionHandled = true;

  if (game.getStatus() === 'lose' || game.getStatus() === 'idle') {
    return;
  }

  switch (direction) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      directionHandled = false;
      break;
  }

  if (directionHandled) {
    renderBoard();
  }
}

function renderBoard() {
  const board = game.getState();

  for (let i = 0; i < game.size; i++) {
    for (let j = 0; j < game.size; j++) {
      const cell = table.rows[i].cells[j];
      const cellValue = board[i][j];

      cell.textContent = cellValue === 0 ? '' : cellValue;

      cell.className =
        cellValue === 0
          ? 'field-cell'
          : `field-cell field-cell--${cellValue} field-cell--transition-effect`;
    }
  }

  gameScore.textContent = game.getScore();
  updateMessage();
}

function showRestartButton() {
  messageStart.classList.add('hidden');
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
}

function updateMessage() {
  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}
