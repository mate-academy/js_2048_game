'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const startButton = document.querySelector('.start');
const gameField = document.querySelector('.game-field');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

function updateBoardUI() {
  const rows = gameField.querySelectorAll('.field-row');
  const score = game.getScore();

  document.querySelector('.game-score').textContent = score;

  game.getState().forEach((row, rowIndex) => {
    const cells = rows[rowIndex].querySelectorAll('.field-cell');

    row.forEach((cellValue, colIndex) => {
      const cell = cells[colIndex];

      cell.textContent = '';
      cell.className = 'field-cell';

      if (cellValue !== 0) {
        cell.textContent = cellValue;
        cell.classList.add(`field-cell--${cellValue}`);
      }
    });
  });
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    updateBoardUI(game);
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
    startMessage.classList.add('hidden');
  } else if (game.getStatus() === 'playing') {
    game.restart();
    updateBoardUI(game);
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    startMessage.classList.remove('hidden');
  }
});

document.addEventListener('keydown', (keyboardEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (keyboardEvent.key) {
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

  if (game.win()) {
    if (game.hasWon) {
      winMessage.classList.remove('hidden');
    }
  }

  if (!game.canMove()) {
    loseMessage.classList.remove('hidden');
  }

  updateBoardUI();
});
