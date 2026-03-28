'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');

function renderBoard() {
  const state = game.getState();

  state.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function renderScore() {
  scoreElement.textContent = game.getScore();
}

function renderMessages() {
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  switch (game.getStatus()) {
    case 'idle':
      startMessage.classList.remove('hidden');
      break;

    case 'win':
      winMessage.classList.remove('hidden');
      break;

    case 'lose':
      loseMessage.classList.remove('hidden');
      break;

    default:
      break;
  }
}

function renderButton() {
  if (game.getStatus() === 'idle') {
    button.textContent = 'Start';
    button.className = 'button start';
  } else {
    button.textContent = 'Restart';
    button.className = 'button restart';
  }
}

function renderGame() {
  renderBoard();
  renderScore();
  renderMessages();
  renderButton();
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  renderGame();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      game.moveLeft();
      break;

    case 'ArrowRight':
      e.preventDefault();
      game.moveRight();
      break;

    case 'ArrowUp':
      e.preventDefault();
      game.moveUp();
      break;

    case 'ArrowDown':
      e.preventDefault();
      game.moveDown();
      break;

    default:
      return;
  }

  renderGame();
});

renderGame();
