'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const field = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');

function renderBoard() {
  const board = game.getState();
  const cells = field.querySelectorAll('.field-cell');
  let cellIndex = 0;

  board.forEach((row) => {
    row.forEach((cell) => {
      const currentCell = cells[cellIndex];

      currentCell.textContent = cell === 0 ? '' : cell;
      currentCell.className = 'field-cell';

      if (cell > 0) {
        currentCell.classList.add(`field-cell--${cell}`);
      }
      cellIndex++;
    });
  });

  scoreElement.textContent = game.getScore();

  const gameStatus = game.getStatus();
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');
  const startMessage = document.querySelector('.message-start');

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.add('hidden');

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  } else if (gameStatus === 'idle') {
    startMessage.classList.remove('hidden');
  }
}

document.querySelector('.start').addEventListener('click', () => {
  if (game.getStatus() !== 'idle') {
    game.restart();
  } else {
    game.start();
  }
  renderBoard();
});

document.addEventListener('keydown', (e) => {
  let moved = false;

  e.preventDefault();

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

    default:
      break;
  }

  if (moved) {
    renderBoard();

    const button = document.querySelector('.start');

    if (!button.classList.contains('restart')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
    }
  }
});
