'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
'use strict';

const Game = require('../modules/Game.class');

const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

let game = null;

function render() {
  const state = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  let index = 0;

  state.forEach((row) => {
    row.forEach((value) => {
      const cell = cells[index];

      cell.textContent = value !== 0 ? value : '';
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }

      index++;
    });
  });

  scoreElement.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageStart.classList.add('hidden');

  if (gameStatus === 'playing') {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (!game || game.getStatus() === 'idle') {
    game = new Game();
    game.start();

    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  if (!game) {
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

  render();
});
