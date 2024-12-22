'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const rows = Array.from(document.querySelectorAll('.field-row'));
const cells = rows.map((row) => {
  Array.from(row.querySelectorAll('.field-cell'));
});

const loseSMS = document.querySelector('.message-lose');
const winSMS = document.querySelector('.message-win');

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
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
    }
    updateTable(game, cells);

    if (game.getStatus() === 'win') {
      winSMS.classList.remove('hidden');
    } else if (game.getStatus() === 'lose') {
      loseSMS.classList.remove('hidden');
    }
  }
});

const startSMS = document.querySelector('.message-start');

const button = document.querySelector('.controls .button');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    updateTable(game, cells);
    startSMS.classList.add('hidden');
    button.textContent = 'Restart';
  }

  if (button.classList.contains('restart')) {
    game.restart();
    updateTable(game, cells);
    startSMS.classList.remove('hidden');
    winSMS.classList.add('hidden');
    loseSMS.classList.add('hidden');
    button.textContent = 'Start';
  }

  button.classList.toggle('start');
  button.classList.toggle('restart');
});

function updateTable(gameInstance, td) {
  // Получаем текущее состояние доски из класса Game
  const board = gameInstance.getState();

  board.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = td[rowIndex][colIndex];
      // Обновляем текстовое содержимое ячейки

      cell.textContent = value === 0 ? '' : value;
      // Удаляем старые классы, соответствующие значениям
      cell.className = 'field-cell'; // Сброс к базовому классу
      // Добавляем новый класс

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });

  // Обновление счёта
  const score = gameInstance.getScore(); // Получаем текущий счёт

  document.querySelector('.game-score').textContent = score;
}
