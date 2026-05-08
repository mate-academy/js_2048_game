'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

// const Game = require('../modules/Game.class');
// Создаём экземпляр игры
const game = new Game();

// Находим элементы DOM для взаимодействия с интерфейсом
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

// Отрисовывает текущее состояние игрового поля
function renderBoard() {
  const state = game.getState(); // Получаем текущее состояние игрового поля

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // Находим соответствующую ячейку в DOM и обновляем её содержимое и классы
      const cell = document.querySelector(
        `.field-row:nth-child(${i + 1}) .field-cell:nth-child(${j + 1})`,
      );
      const value = state[i][j];

      // Если значение 0 — ячейка пустая, иначе показываем число
      cell.textContent = value || '';

      // Сбрасываем все классы до базового
      cell.className = 'field-cell';

      // Добавляем класс с цветом для конкретного числа
      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  scoreEl.textContent = game.getScore();
}

function renderStatus() {
  const gameStatus = game.getStatus();

  // Скрываем все сообщения
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  // Показываем сообщение соответствующее текущему статусу
  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }
}

startBtn.addEventListener('click', () => {
  // Если кнопка ещё не была нажата — меняем её внешний вид
  if (startBtn.classList.contains('start')) {
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
  }

  game.start(); // Запускаем/перезапускаем игру
  renderBoard();
  renderStatus();
  messageStart.classList.add('hidden'); // Скрываем стартовое сообщение
});

/** Обработчик нажатий клавиш для управления игрой.
 * Реагирует только если игра в процессе.
 */

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp('up');
      break;
    case 'ArrowDown':
      game.moveDown('down');
      break;
    case 'ArrowLeft':
      game.moveLeft('left');
      break;
    case 'ArrowRight':
      game.moveRight('right');
      break;
  }
  renderBoard();
  renderStatus();
});
