'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

const scoreEl = document.querySelector('.game-score');
const buttonEl = document.querySelector('button.start');
const cells = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function hideAllMessages() {
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
}

function showMessageByStatus() {
  hideAllMessages();

  const gameStatus = game.getStatus();

  switch (gameStatus) {
    case 'idle':
      messageStart.classList.remove('hidden');
      break;

    case 'win':
      messageWin.classList.remove('hidden');
      break;

    case 'lose':
      messageLose.classList.remove('hidden');
      break;
  }
}

function render() {
  const state = game.getState();

  scoreEl.textContent = String(game.getScore());

  let i = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = state[r][c];
      const cell = cells[i];

      cell.textContent = value === 0 ? '' : String(value);

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }

      i++;
    }
  }

  showMessageByStatus();

  if (game.getStatus() === 'idle') {
    buttonEl.textContent = 'Start';
    buttonEl.classList.add('start');
    buttonEl.classList.remove('restart');
  } else {
    buttonEl.textContent = 'Retart';
    buttonEl.classList.add('restart');
    buttonEl.classList.remove('start');
  }
}

buttonEl.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  render();
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
    render();
  }
});

render();
