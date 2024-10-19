'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

updateUI();

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

button.addEventListener('click', () => {
  if (game.status === 'idle') {
    game.start();

    messageStart.classList.add('hidden');
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();
    button.textContent = 'Start';

    button.classList.remove('restart');
    button.classList.add('start');
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
    return;
  }

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

    default:
      return;
  }

  updateUI();
  game.checkGameState();

  if (game.status === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (game.status === 'win') {
    messageWin.classList.remove('hidden');
  }
});

function updateUI() {
  const cells = document.querySelectorAll('.field-cell');

  for (let row = 0; row < game.state.length; row++) {
    for (let col = 0; col < game.state[row].length; col++) {
      const value = game.state[row][col];
      const cellIndex = row * 4 + col;
      const cell = cells[cellIndex];

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }

      if (value === 0) {
        cell.textContent = '';
      }
    }
  }

  const scoreElement = document.querySelector('.game-score');

  scoreElement.textContent = game.score;
}
