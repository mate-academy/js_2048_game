'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
import Game from '../modules/Game.class.js';

const game = new Game();

const scoreEl = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');
const startBtn = document.querySelector('.button.start');
const restartBtn = document.querySelector('.button.restart');

window.game = game;

// ================= UI UPDATE =================

function updateUI() {
  scoreEl.textContent = game.getScore();

  const statusGame = game.getStatus();

  if (!game.hasStarted) {
    startBtn.classList.remove('hidden');
    restartBtn.classList.add('hidden');
  } else {
    startBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
  }

  // Оновлення ігрового поля та кольорів плиток
  const board = game.getState();
  const flatBoard = board.flat();

  cells.forEach((cell, index) => {
    const value = flatBoard[index];

    cell.textContent = value === 0 ? '' : value;

    // Скидаємо класи до базового, щоб не дублювалися cell--2, cell--4 тощо
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  // Керування повідомленнями за допомогою toggle
  messageStart.classList.toggle('hidden', statusGame !== 'idle');
  messageWin.classList.toggle('hidden', statusGame !== 'win');
  messageLose.classList.toggle('hidden', statusGame !== 'lose');
}

// Початковий виклик, щоб інтерфейс відповідав стану "idle"
updateUI();

// ================= CONTROLS =================

document.addEventListener('keydown', (e) => {
  // Реагуємо лише на стрілки
  const arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (!arrows.includes(e.key)) {
    return;
  }

  // Автоматичний старт при першому натисканні стрілки
  if (game.getStatus() === 'idle') {
    game.start();
  }

  switch (e.key) {
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
  }

  updateUI();
});

// ================= КНОПКИ =================

startBtn.addEventListener('click', () => {
  game.start();
  updateUI();
});

restartBtn.addEventListener('click', () => {
  game.restart();
  updateUI();
});
