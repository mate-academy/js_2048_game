'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

const Game = require('../modules/Game.class');
const game = new Game();

// елементи DOM
const cells = Array.from(document.querySelectorAll('.field-cell'));
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

// відмалювати поле
function renderBoard() {
  const board = game.getState().flat();

  cells.forEach((cell, i) => {
    const value = board[i];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell'; // скидаємо стилі

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
  scoreElement.textContent = game.getScore();
  renderStatus();
}

function renderStatus() {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

// запуск гри
function startGame() {
  game.start();
  renderBoard();
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    startGame();
  } else {
    startGame(); // замість restartGame(), бо ми хочемо одразу старт
  }
});

// обробка клавіш
document.addEventListener('keydown', (e) => {
  let moved = false;

  switch (e.key) {
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
    renderBoard();
  }
});
