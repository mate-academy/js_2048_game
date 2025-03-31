'use strict';
import { Game } from './game.js';

const game = new Game();
const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
let isGameStarted = false;

// Функція для відображення повідомлень
function showMessage(type) {
  const messages = document.querySelectorAll('.message');

  messages.forEach((message) => message.classList.add('hidden'));

  const startMessage = document.querySelector('.message-start');

  if (startMessage) {
    startMessage.classList.add('hidden');
  }

  const messageElement = document.querySelector(`.message-${type}`);

  if (messageElement) {
    messageElement.classList.remove('hidden');
  }
}

// інтерфейс гри
function updateGameView() {
  const grid = document.querySelector('.game-field tbody');

  grid.innerHTML = '';

  game.getState().board.forEach((row) => {
    const rowElement = document.createElement('tr');

    rowElement.classList.add('field-row');

    row.forEach((cell) => {
      const cellElement = document.createElement('td');

      cellElement.classList.add('field-cell');

      if (cell !== 0) {
        cellElement.textContent = cell;
        cellElement.classList.add(`field-cell--${cell}`);
      }

      rowElement.appendChild(cellElement);
    });

    grid.appendChild(rowElement);
  });

  // Оновлюємо рахунок - ТІЛЬКИ число, без тексту "Score:"
  scoreElement.textContent = game.getState().score;
}

// Обробка клавіш стрілок
document.addEventListener('keydown', function (e) {
  if (!isGameStarted) {
    return; // Не реагуємо на клавіші, якщо гра не розпочата
  }

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

  if (moved) {
    game.addRandomTile();
    updateGameView();

    if (game.getStatus() === 'win') {
      showMessage('win');
    } else if (game.getStatus() === 'lose') {
      showMessage('lose');
    }
  }
});

// Обробка натискання кнопки "Start/Restart"
startButton.addEventListener('click', function () {
  if (!isGameStarted) {
    game.start();
    updateGameView();

    // Ховаємо початкове повідомлення
    document.querySelector('.message-start').classList.add('hidden');

    // Зміна тексту кнопки після початку гри
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
    isGameStarted = true;
  } else {
    game.restart();
    updateGameView();

    // Ховаємо будь-які повідомлення, які могли бути показані
    const messages = document.querySelectorAll('.message');

    messages.forEach((message) => message.classList.add('hidden'));
  }
});
