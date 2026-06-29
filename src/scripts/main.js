'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const scoreElement = document.querySelector('.game-score');

const cells = document.querySelectorAll('.field-cell');

const hiddenClass = 'hidden';

restartButton.classList.add(hiddenClass);

function renderBoard() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;

    const value = state[row][col];

    cell.className = 'field-cell';

    if (value === 0) {
      cell.textContent = '';
    } else {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  });

  renderScore();
  renderMessages();
}

function renderScore() {
  scoreElement.textContent = game.getScore();
}

function renderMessages() {
  winMessage.classList.add(hiddenClass);
  loseMessage.classList.add(hiddenClass);

  if (game.getStatus() === 'win') {
    winMessage.classList.remove(hiddenClass);
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove(hiddenClass);
  }
}

startButton.addEventListener(
  'click',
  () => {
    game.start();

    startButton.classList.add(hiddenClass);
    restartButton.classList.remove(hiddenClass);

    startMessage.classList.add(hiddenClass);

    renderBoard();
  },
  { once: true },
);

restartButton.addEventListener('click', () => {
  game.restart();

  winMessage.classList.add(hiddenClass);
  loseMessage.classList.add(hiddenClass);

  renderBoard();
});

document.addEventListener('keydown', (eventListener) => {
  if (game.getStatus() === 'idle') {
    return;
  }

  switch (eventListener.key) {
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

  renderBoard();
});

renderBoard();
