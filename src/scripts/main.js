'use strict';

const Game = require('../modules/Game.class');
// eslint-disable-next-line no-unused-vars
const game = new Game();

const getButtonStart = document.querySelector('button');
const getCell = document.querySelectorAll('.field-cell');
// eslint-disable-next-line no-unused-vars
const getTBody = document.querySelectorAll('tbody td');

// Додаємо обробку натискання на кнопку "Start"
// eslint-disable-next-line no-shadow
getButtonStart.addEventListener('click', function (event) {
  if (event.target.tagName === 'BUTTON') {
    getButtonStart.classList.remove('start');
    getButtonStart.classList.add('restart');
    getButtonStart.textContent = 'Restart';
    game.start(); // Починаємо гру
    renderField(game.state); // Відображаємо початковий стан поля
  }
});

// Функція для рендерингу поля
function renderField(state) {
  getCell.forEach((cell) => {
    cell.textContent = ''; // Очищаємо поле
    cell.classList.remove('field-cell--2', 'field-cell--4'); // Очищаємо класи
  });

  // Перебираємо масив і відображаємо значення в клітинках
  state.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const cellElement = getCell[rowIndex * 4 + cellIndex];

      if (cell !== 0) {
        cellElement.textContent = cell;
        cellElement.classList.add(`field-cell--${cell}`);
      }
    });
  });
}

// Логіка для руху
document.addEventListener('keydown', function (e) {
  if (e) {
    if (e.key === 'ArrowRight') {
      // eslint-disable-next-line no-console
      console.log('Right');
      game.moveRight();
      renderField(game.state); // Відображаємо оновлене поле після руху
    }

    if (e.key === 'ArrowLeft') {
      // eslint-disable-next-line no-console
      console.log('Left');
      game.moveLeft();
      renderField(game.state); // Відображаємо оновлене поле після руху
    }

    if (e.key === 'ArrowUp') {
      // eslint-disable-next-line no-console
      console.log('Up');
      game.moveUp();
      renderField(game.state); // Відображаємо оновлене поле після руху
    }

    if (e.key === 'ArrowDown') {
      // eslint-disable-next-line no-console
      console.log('Down');
      game.moveDown();
      renderField(game.state); // Відображаємо оновлене поле після руху
    }
  }
});
