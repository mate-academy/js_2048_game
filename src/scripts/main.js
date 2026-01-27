'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button');
const startMsg = document.querySelector('.message-start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');

// Функція для малювання стану гри
function drawGame() {
  const field = game.getState();

  for (let i = 0; i < cells.length; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = field[row][col];

    // Очищуємо старі значення та класи
    cells[i].textContent = value === 0 ? '' : value;
    cells[i].className = 'field-cell';

    // Додаємо клас для стилізації клітинок з числами
    if (value !== 0) {
      cells[i].classList.add(`field-cell--${value}`);
    }
  }

  // Оновлюємо рахунок
  scoreEl.textContent = game.getScore();

  // Відображення повідомлень про виграш / поразку
  if (game.getStatus() === 'win') {
    winMsg.classList.remove('hidden');
  } else {
    winMsg.classList.add('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMsg.classList.remove('hidden');
  } else {
    loseMsg.classList.add('hidden');
  }
}

// Старт / Рестарт кнопка
startBtn.addEventListener('click', () => {
  game.restart(); // Скидаємо стан
  game.start(); // Додаємо першу плитку

  // Ховаємо всі повідомлення
  startMsg.classList.add('hidden');
  winMsg.classList.add('hidden');
  loseMsg.classList.add('hidden');

  // Змінюємо текст кнопки
  startBtn.textContent = 'Restart';

  drawGame();
});

// Обробка клавіш
document.addEventListener('keydown', (e) => {
  let moved = false;

  switch (e.key) {
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
  }

  // Оновлюємо гру тільки якщо хід був можливий
  if (moved) {
    drawGame();
  }
});
