'use strict';

// Uncomment the next lines to use your game instance in the browser
import { Game } from '../modules/Game.class.js';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const cells = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateUi() {
  const board = game.getState();
  const flatBoard = board.flat();

  flatBoard.forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value !== 0 ? value : '';
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  updateMessage();
}

function updateMessage() {
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

  if (currentStatus === 'idle') {
    messageStart.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';

  updateUi();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing' && game.getStatus() !== 'win') {
    return;
  }

  const moveKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  if (moveKeys.includes(e.key)) {
    e.preventDefault();

    switch (e.key) {
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
    }
    updateUi();
  }
});
