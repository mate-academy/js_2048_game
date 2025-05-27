'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
// const gameField = document.querySelector('.game-field');

// Отримати всі 16 td клітинок
const gameCells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button'); // Кнопка "Start"
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateUI() {
  const board = game.getState();
  const score = game.getScore();
  const statuss = game.getStatus();

  // Оновлюємо клітинки візуально
  gameCells.forEach((cellElement, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    // Очистити старі класи значень, залишаючи базовий .field-cell
    cellElement.className = 'field-cell';

    if (value !== 0) {
      cellElement.classList.add(`field-cell--${value}`);
      cellElement.textContent = value;
    } else {
      cellElement.textContent = ''; // Пуста клітинка
    }
  });

  // Оновлюємо рахунок
  scoreElement.textContent = score;

  // Оновлюємо повідомлення
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (statuss === 'win') {
    messageWin.classList.remove('hidden');
    // ... оновити кнопку на "Restart"
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else if (statuss === 'lose') {
    messageLose.classList.remove('hidden');
    // ... оновити кнопку на "Restart"
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else if (statuss === 'playing') {
    // Приховати стартове повідомлення після першого ходу/старту
    messageStart.classList.add('hidden');
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else {
    // statuss === 'idle'
    messageStart.classList.remove('hidden');
    startButton.classList.add('start');
    startButton.classList.remove('restart');
    startButton.textContent = 'Start';
  }
}

// Припустимо, 'game' - це твій екземпляр класу Game
// const game = new Game(); // Створюємо екземпляр гри

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  updateUI(); // Оновити інтерфейс після дії
});

document.addEventListener('keydown', (eventt) => {
  if (game.getStatus() === 'playing') {
    if (eventt.key === 'ArrowLeft') {
      game.moveLeft();
    } else if (eventt.key === 'ArrowRight') {
      game.moveRight();
    } else if (eventt.key === 'ArrowUp') {
      game.moveUp();
    } else if (eventt.key === 'ArrowDown') {
      game.moveDown();
    } else {
      return; // Ігноруємо інші клавіші
    }
    updateUI(); // Оновити інтерфейс після ходу
  }
});

// В кінці main.js
updateUI(); // Перше оновлення UI при завантаженні сторінки
