'use strict';
import { statuses, Game } from '../modules/Game.class';

const game = new Game();
const gameField = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const messageContainer = document.querySelector('.message-container');

function updateUI() {
  const state = game.getState();

  const rows = gameField.querySelectorAll('.field-row');

  rows.forEach((rowElement, rowIndex) => {
    const cells = rowElement.querySelectorAll('.field-cell');

    cells.forEach((cellElement, colIndex) => {
      const value = state[rowIndex][colIndex];

      cellElement.textContent = value || '';
      cellElement.className = 'field-cell';

      if (value) {
        cellElement.classList.add(`field-cell--${value}`);
      }
    });
  });

  scoreElement.textContent = game.getScore();
}

startButton.addEventListener('click', () => {
  game.restart();
  updateUI();

  startButton.classList.remove('start');
  startButton.classList.add('restart');

  startButton.textContent = 'Restart';

  messageContainer.querySelectorAll('.message').forEach((el) => {
    el.classList.add('hidden');
  });
});

document.addEventListener('keydown', (keyEvent) => {
  if (game.getStatus() !== statuses.playing) {
    return;
  }

  switch (keyEvent.key) {
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

  updateUI();

  if (game.getStatus() === statuses.win) {
    messageContainer.querySelector('.message-win').classList.remove('hidden');
  } else if (game.getStatus() === statuses.lose) {
    messageContainer.querySelector('.message-lose').classList.remove('hidden');
  }
});
