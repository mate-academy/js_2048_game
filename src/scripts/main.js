'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

// Write your code here

const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const fieldCells = document.querySelectorAll('.field-cell');

/**
 * Оновлює DOM на основі стану гри
 */
function renderBoard() {
  const state = game.getState();

  state.forEach((row, r) => {
    row.forEach((value, c) => {
      const index = r * 4 + c;
      const cell = fieldCells[index];

      // Очистити попереднє значення
      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell'; // скинути всі класи

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  });

  // Оновити рахунок
  scoreEl.textContent = game.getScore();

  // Показати/сховати повідомлення
  messageStart.classList.add('hidden');

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else {
    messageWin.classList.add('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  } else {
    messageLose.classList.add('hidden');
  }
}

/**
 * Обробка натисків клавіш
 */
function handleKey(evn) {
  switch (evn.key) {
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
      return; // інші клавіші ігноруємо
  }

  renderBoard();
}

/**
 * Почати або перезапустити гру
 */
function startGame() {
  if (game.getStatus() === 'idle') {
    game.start();
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  } else {
    game.restart();
    game.start();
  }

  renderBoard();
}

// Підключаємо події
startBtn.addEventListener('click', startGame);
document.addEventListener('keydown', handleKey);

// Початкове відображення
renderBoard();
