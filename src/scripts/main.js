'use strict';

// Якщо ти використовуєш Node.js/Bundler (як Webpack), розкоментуй рядок нижче:
import Game from '../modules/Game.class.js';

const game = new Game();

// Знаходимо елементи на сторінці
const cells = document.querySelectorAll('.field-cell');
const scoreLabel = document.querySelector('.game-score');
const button = document.querySelector('.button');

// Повідомлення
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

// Функція для оновлення вигляду дошки
function updateView() {
  const state = game.getState();
  let cellIndex = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = cells[cellIndex];
      const value = state[i][j];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
      }
      cellIndex++;
    }
  }

  scoreLabel.textContent = game.getScore();
  updateStatusView();
}

// Функція для зміни вигляду елементів інтерфейсу
function updateStatusView() {
  const gameStatus = game.getStatus();

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (gameStatus === 'idle') {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    startMessage.classList.remove('hidden');
  } else if (gameStatus === 'playing') {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    startMessage.classList.add('hidden');
  } else if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  }
}

// кнопка
button.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  updateView();
  updateStatusView();
});

// додаємо можливість натискати стрілки
document.addEventListener('keydown', (e) => {
  e.preventDefault();

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  updateView();
});
