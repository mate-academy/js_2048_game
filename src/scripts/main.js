'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.button.start');
const scoreElem = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');

function renderBoard() {
  const state = game.getState();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = cells[i * 4 + j];

      cell.textContent = state[i][j] === 0 ? '' : state[i][j];

      cell.className = 'field-cell';

      if (state[i][j] !== 0) {
        cell.classList.add(`field-cell--${state[i][j]}`);
      }
    }
  }

  scoreElem.textContent = game.getScore();
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    messageStart.classList.add('hidden');

    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();
    game.start();
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }

  renderBoard();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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

    if (game.getStatus() === 'win') {
      messageWin.classList.remove('hidden');
    }

    if (game.getStatus() === 'lose') {
      messageLose.classList.remove('hidden');
    }
  }
});
