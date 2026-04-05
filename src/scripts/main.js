'use strict';

import Game from '../modules/Game.class.js';

// Селектори елементів
const gameScoreElement = document.querySelector('.game-score');

const cells = document.querySelectorAll('.field-cell');
const btnControl = document.querySelector('.button');

const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

// Ініціалізація гри
const game = new Game();

/**
 * Оновлює візуальний стан гри в DOM
 */
function updateUI() {
  const board = game.getState().flat(); // Отримуємо лінійний масив 16 елементів
  const score = game.getScore();
  const gameStatus = game.getStatus();

  // 1. Оновлюємо клітинки
  cells.forEach((cell, index) => {
    const value = board[index];

    // Встановлюємо текст (пусто, якщо 0)
    cell.textContent = value === 0 ? '' : value;

    // Скидаємо класи значень, але залишаємо основний 'field-cell'
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  // 2. Оновлюємо рахунок
  gameScoreElement.textContent = score;

  // 3. Обробка повідомлень та статусів
  msgWin.classList.toggle('hidden', gameStatus !== 'win');
  msgLose.classList.toggle('hidden', gameStatus !== 'lose');

  if (gameStatus !== 'idle') {
    msgStart.classList.add('hidden');
  }
}

/**
 * Логіка кнопки Start/Restart
 */
btnControl.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    // Скидаємо кнопку до початкового стану "Start" при рестарті
    btnControl.textContent = 'Start';
    btnControl.classList.add('start');
    btnControl.classList.remove('restart');
  }
  updateUI();
});

/**
 * Обробка натискання клавіш
 */
document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (event.key) {
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
      return; // Виходимо, якщо натиснута не стрілка
  }

  // Якщо хід відбувся (щось змінилося на полі)
  if (moved) {
    // Правило: Змінити Start на Restart після першого ходу
    if (btnControl.classList.contains('start')) {
      btnControl.textContent = 'Restart';
      btnControl.classList.remove('start');
      btnControl.classList.add('restart');
    }
    updateUI();
  }
});
