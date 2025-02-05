'use strict';
import { statuses, Game } from '../modules/Game.class';

// const Game = require('../modules/Game.class');
// require - один з різновидів імпортів (Home work!)
const game = new Game();
const gameField = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const messageContainer = document.querySelector('.message-container');

function updateUI() {
  const state = game.getState(); // Отримуємо поточний стан гри

  const rows = gameField.querySelectorAll('.field-row');

  rows.forEach((rowElement, rowIndex) => {
    const cells = rowElement.querySelectorAll('.field-cell');

    cells.forEach((cellElement, colIndex) => {
      const value = state[rowIndex][colIndex];

      cellElement.textContent = value || ''; // Оновлюємо текст у клітинці
      cellElement.className = 'field-cell'; // Скидаємо класи клітинки

      if (value) {
        cellElement.classList.add(`field-cell--${value}`); // Додаємо клас для стилізації клітинки
      }
    });
  });

  scoreElement.textContent = game.getScore(); // Оновлюємо елемент з рахунком
}

startButton.addEventListener('click', () => {
  game.restart();
  updateUI();

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
