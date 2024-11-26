'use strict';

const Game = require('../modules/Game.class');
// eslint-disable-next-line no-unused-vars
const game = new Game();

const getButtonStart = document.querySelector('button');
const getCell = document.querySelectorAll('.field-cell');
// eslint-disable-next-line no-unused-vars
const getTBody = document.querySelectorAll('tbody td');
let click = 0;

// Додаємо обробку натискання на кнопку "Start"
// eslint-disable-next-line no-shadow
getButtonStart.addEventListener('click', function (event) {
  if (event.target.tagName === 'BUTTON') {
    // getButtonStart.classList.remove('start');
    // getButtonStart.textContent = 'Restart';
    click++;

    getButtonStart.classList.add('start');

    if (click === 1) {
      game.start(); // Start the game
      renderField(game.state); // Display the initial game state
    } else if (click > 1) {
      game.restart();
      renderField(game.state);
    }
  }
});

// Функція для рендерингу поля
function renderField(state) {
  getCell.forEach((cell) => {
    cell.textContent = ''; // Очищаємо поле

    cell.classList.remove(
      'field-cell--2',
      'field-cell--4',
      'field-cell--8',
      'field-cell--16',
      'field-cell--32',
      'field-cell--64',
      'field-cell--128',
      'field-cell--256',
      'field-cell--512',
      'field-cell--1024',
      'field-cell--2048',
    ); // Очищаємо класи
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
    if (
      e.key === 'ArrowRight' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown'
    ) {
      getButtonStart.classList.remove('start');
      getButtonStart.classList.add('restart');
      getButtonStart.textContent = 'Restart';
    }

    switch (e.key) {
      case 'ArrowRight':
        // eslint-disable-next-line no-console
        console.log('Right');
        game.moveRight();
        break;
      case 'ArrowLeft':
        // eslint-disable-next-line no-console
        console.log('Left');
        game.moveLeft();
        break;
      case 'ArrowUp':
        // eslint-disable-next-line no-console
        console.log('Up');
        game.moveUp();
        break;
      case 'ArrowDown':
        // eslint-disable-next-line no-console
        console.log('Down');
        game.moveDown();
        break;
      default:
        return;
    }

    renderField(game.state); // Відображаємо оновлене поле після руху
  }
});

game.getStatus();
