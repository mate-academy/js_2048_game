'use strict';

// Uncomment the next lines to use your game instance in the browser
import { Game } from '../modules/Game.class.js';
// eslint-disable-next-line no-unused-vars

// Ініціалізація основних елементів
const game = new Game();
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const cells = document.querySelectorAll('.field-cell');
// Елементи повідомлень
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

// Write your code here
function updateBoard() {
  const field = game.getState(); // Отримуємо матрицю 4x4 з класу Game

  cells.forEach((cell, i) => {
    // Обчислюємо координати для матриці на основі порядкового номера i (0-15)
    const x = Math.floor(i / 4);
    const y = i % 4;
    const value = field[x][y];

    // Очищаємо попередні класи значень, щоб вони не накопичувалися
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.textContent = value;
      // Додаємо клас для стилізації конкретного числа (наприклад, .cell-8)
      cell.classList.add(`field-cell--${value}`);
    } else {
      // Що ми маємо записати в cell.textContent, якщо значення 0?
      cell.textContent = '';
    }
  });
}
/**
 * Виводить поточний рахунок у HTML
 */

function updateScore() {
  scoreElement.textContent = game.getScore();
}

/**
 * Перевіряє статус гри та показує відповідні вікна
 */
function checkStatus() {
  // Отримуємо поточний стан гри (start, playing, win або lose)
  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  // Якщо гра в процесі або завершилася, кнопка = вигляд "Restart"
  if (status === 'playing' || status === 'win' || status === 'lose') {
    // Змінюємо текст кнопки на "Restart"
    startButton.textContent = 'Restart';
    // Видаляємо клас початкового стану+додаємо клас для актив.гри/перезапуску
    startButton.classList.remove('start');
    startButton.classList.add('restart');

    // Тепер окремо перевіряємо, чи потрібно показати повідомлення про фінал
    if (status === 'win') {
      // Показуємо вікно перемоги, якщо статус 'win'
      winMessage.classList.remove('hidden');
    } else if (status === 'lose') {
      // Показуємо вікно програшу, якщо статус 'lose'
      loseMessage.classList.remove('hidden');
    }
    // Якщо статус 'playing', повідомлення залишаються прихованими
  } else {
    // Якщо гра ще не почалася, повертаємо кнопці початковий вигляд
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');

    // Про всяк випадок переконуємося, що повідомлення приховані
    hideMessages();
  }
}

/**
 * Приховує всі повідомлення (використовується при старті гри)
 */
function hideMessages() {
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.add('hidden');
}

// Обробка натискань клавіш

window.addEventListener('keydown', (ev) => {
  let moved = false;

  switch (ev.key) {
    case 'ArrowUp':
      moved = game.moveUp(); // повертає true, якщо плитки посунулися
      break;
    case 'ArrowDown':
      moved = game.moveDown(); // повертає true, якщо плитки посунулися
      break;
    case 'ArrowLeft':
      moved = game.moveLeft(); // повертає true, якщо плитки посунулися
      break;
    case 'ArrowRight':
      moved = game.moveRight(); // повертає true, якщо плитки посунулися
      break;
    default:
      return; // Якщо натиснута клавіша не є стрілкою, нічого не робимо
  }

  // Якщо хід відбувся, потрібно щось зробити...
  if (moved) {
    updateBoard();
    // eslint-disable-next-line no-undef
    updateScore(); // Оновлюємо відображення рахунку після кожного ходу
    checkStatus(); // Перевіряємо статус гри після кожного ходу
  }

  updateBoard(); // Оновлюємо відображення після кожного ходу
});

startButton.addEventListener('click', () => {
  // <-- додай це для перевірки, чи працює обробник подій
  // 1. Спочатку ховаємо всі повідомлення про виграш чи програш
  hideMessages();

  // 2. Викликаємо метод перезапуску в логіці гри.
  // Він обнулить рахунок і створить нове поле з 2 плитками.
  game.restart();
  scoreElement.textContent = game.getScore();

  // 3. Тепер синхронізуємо стан гри з тим, що бачить користувач
  updateBoard(); // Малюємо нові плитки
  updateScore(); // Виводимо "0" у полі рахунку

  // 4. Викликаємо нашу універсальну функцію для перевірки статусу.
  // Вона сама перевірить game.getStatus() і оновить кнопку/стилі.
  checkStatus();
});
