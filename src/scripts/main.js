// 'use strict';

// // Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
let game;
const rows = 4;
const columns = 4;

// Запуск гри при завантаженні сторінки
window.onload = function () {
  setupGame();
};

// Ініціалізація гри та підключення до DOM
function setupGame() {
  game = new Game();
  game.start();
  updateGameField();

  // Додаємо обробники подій для клавіш
  document.addEventListener('keyup', handleKeyPress);
}

// Оновлення ігрового поля в DOM
function updateGameField() {
  const board = game.getState();
  const fieldRows = document.querySelectorAll('.field-row');

  if (!fieldRows || fieldRows.length === 0) {
    return;
  }

  for (let r = 0; r < rows; r++) {
    const cells = fieldRows[r].children; // Клітинки в рядку

    for (let c = 0; c < columns; c++) {
      const cell = cells[c];
      const num = board[r][c];

      updateCell(cell, num);
    }
  }

  // Оновлюємо рахунок
  document.querySelector('game-score').textContent =
    `Score: ${game.getScore()}`;
}

// Оновлення стилю окремої клітинки
function updateCell(cell, num) {
  cell.textContent = '';
  cell.classList = 'field-cell'; // Скидаємо класи

  if (num > 0) {
    cell.textContent = num;

    if (num <= 1024) {
      cell.classList.add(`field-cell--${num}`);
    } else {
      cell.classList.add('field-cell--2048');
    }
  }
}

// Обробка натискання клавіш
function handleKeyPress(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.code) {
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

  // Оновлюємо поле після кожного ходу
  updateGameField();

  // Перевіряємо статус гри
  if (game.getStatus() === 'win') {
    alert('You win!');
  } else if (game.getStatus() === 'lose') {
    alert('Game over!');
  }
}
