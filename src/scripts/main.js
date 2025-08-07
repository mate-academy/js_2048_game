'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateView() {
  const state = game.getState();
  let index = 0;

  for (const row of state) {
    for (const cell of row) {
      const el = cells[index++];

      el.className = 'field-cell';

      if (cell !== 0) {
        el.classList.add(`field-cell--${cell}`);
        el.textContent = cell;
      } else {
        el.textContent = '';
      }
    }
  }

  score.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

function startGame() {
  game.start();
  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  updateView();
}

button.addEventListener('click', () => {
  startGame();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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

  updateView();
});
