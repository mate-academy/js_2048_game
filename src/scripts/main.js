'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

// Write your code here
const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const buttonElement = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function renderGame() {
  renderBoard();
  renderScore();
  renderMessages();
  renderButton();
}

function renderBoard() {
  const state = game.getState().flat();

  cells.forEach((cell, index) => {
    const value = state[index];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function renderScore() {
  scoreElement.textContent = game.getScore();
}

function renderMessages() {
  const statusMessage = game.getStatus();

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (statusMessage === 'idle') {
    startMessage.classList.remove('hidden');
  }

  if (statusMessage === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (statusMessage === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

function renderButton() {
  const statusButton = game.getStatus();

  if (statusButton === 'idle') {
    buttonElement.textContent = 'Start';
    buttonElement.className = 'button start';

    return;
  }

  buttonElement.textContent = 'Restart';
  buttonElement.className = 'button restart';
}

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

    default:
      return;
  }

  renderGame();
});

buttonElement.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  renderGame();
});

renderGame();
