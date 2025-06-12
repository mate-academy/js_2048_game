'use strict';

const Game = require('../modules/Game.class'); // залишаємо як є
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.button.start');

  // Додаємо ID для кожної клітинки (0-0, 0-1, ..., 3-3)
  const rows = document.querySelectorAll('.field-row');

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, colIndex) => {
      cell.id = `${rowIndex}-${colIndex}`;
    });
  });

  // Обробка натискання "Start"
  startButton.addEventListener('click', () => {
    game.restart();

    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  });

  // Обробка натискання клавіш
  document.addEventListener('keydown', (e) => {
    game.handleKey(e.key);
  });
});
