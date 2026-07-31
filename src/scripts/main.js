'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const scoreElement = document.querySelector('.game-score');
const buttonElement = document.querySelector('.button');
const cellElements = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  if (scoreElement) {
    scoreElement.textContent = score;
  }

  let cellIdx = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = cellElements[cellIdx++];

      if (!cell) {
        continue;
      }

      const value = state[r][c];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
    }
  }

  if (gameStatus === 'idle') {
    messageStart?.classList.remove('hidden');
    messageWin?.classList.add('hidden');
    messageLose?.classList.add('hidden');
  } else if (gameStatus === 'playing') {
    messageStart?.classList.add('hidden');
    messageWin?.classList.add('hidden');
    messageLose?.classList.add('hidden');
  } else if (gameStatus === 'win') {
    messageStart?.classList.add('hidden');
    messageWin?.classList.remove('hidden');
    messageLose?.classList.add('hidden');
  } else if (gameStatus === 'lose') {
    messageStart?.classList.add('hidden');
    messageWin?.classList.add('hidden');
    messageLose?.classList.remove('hidden');
  }
}

if (buttonElement) {
  buttonElement.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
      game.start();
    } else {
      game.restart();
      buttonElement.className = 'button restart';
      buttonElement.textContent = 'Restart';
    }
    render();
  });
}

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (
    key !== 'ArrowLeft' &&
    key !== 'ArrowRight' &&
    key !== 'ArrowUp' &&
    key !== 'ArrowDown'
  ) {
    return;
  }

  e.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (key) {
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

  if (buttonElement && buttonElement.classList.contains('start')) {
    buttonElement.className = 'button restart';
    buttonElement.textContent = 'Restart';
  }

  render();
});

render();
