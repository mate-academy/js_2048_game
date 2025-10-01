'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

function renderBoard(state) {
  const flatBoard = state.board.flat();

  flatBoard.forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = state.score;

  messageStart.classList.add('hidden');

  if (state.status === 'won') {
    messageWin.classList.remove('hidden');
  }

  if (state.status === 'lost') {
    messageLose.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  messageLose.classList.add('hidden');
  game.restart();
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  renderBoard(game.getState());
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

  renderBoard(game.getState());
});
