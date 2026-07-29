'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button.start');
const scoreEl = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState();

  state.forEach((row, rowIndex) => {
    const cells = fieldRows[rowIndex].querySelectorAll('.field-cell');

    row.forEach((value, colIndex) => {
      const cell = cells[colIndex];

      // Прибираємо всі попередні класи field-cell--N
      cell.className = 'field-cell';
      cell.textContent = '';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
    });
  });
}

function renderScore() {
  scoreEl.textContent = game.getScore();
}

function renderMessages() {
  const currentStatus = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (currentStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (currentStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function updateUI() {
  renderBoard();
  renderScore();
  renderMessages();
}

function handleMove(moveFn) {
  const prevState = JSON.stringify(game.getState());

  moveFn();

  const newState = JSON.stringify(game.getState());

  if (prevState !== newState) {
    updateUI();
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'playing') {
    game.restart();
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    renderBoard();
    renderScore();

    return;
  }

  game.start();
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
  messageStart.classList.add('hidden');
  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      handleMove(() => game.moveLeft());
      break;

    case 'ArrowRight':
      e.preventDefault();
      handleMove(() => game.moveRight());
      break;

    case 'ArrowUp':
      e.preventDefault();
      handleMove(() => game.moveUp());
      break;

    case 'ArrowDown':
      e.preventDefault();
      handleMove(() => game.moveDown());
      break;

    default:
      break;
  }
});
