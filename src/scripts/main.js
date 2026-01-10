'use strict';
import Game from '../modules/Game.class.js';

const game = new Game();

// Селектори
const scoreEl = document.querySelector('.game-score');
const buttonEl = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();
  const gameStatus = game.getStatus();

  scoreEl.textContent = game.getScore();

  // Оновлюємо кожну клітинку
  cells.forEach((cell, i) => {
    const r = Math.floor(i / 4);
    const c = i % 4;
    const value = state[r][c];

    cell.textContent = value === 0 ? '' : value;

    // Скидаємо класи та додаємо потрібний для кольору
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  // Логіка повідомлень (Вимоги 7, 8, 9)
  msgStart.classList.toggle('hidden', gameStatus !== 'idle');
  msgWin.classList.toggle('hidden', gameStatus !== 'win');
  msgLose.classList.toggle('hidden', gameStatus !== 'lose');

  // Логіка кнопки (Вимоги 10, 11)
  if (gameStatus === 'idle') {
    buttonEl.textContent = 'Start';
    buttonEl.classList.add('start');
    buttonEl.classList.remove('restart');
  } else {
    buttonEl.textContent = 'Restart';
    buttonEl.classList.add('restart');
    buttonEl.classList.remove('start');
  }
}

// Керування клавішами
document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  // Використовуємо camelCase назви методів
  if (e.key === 'ArrowLeft') {
    moved = game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    moved = game.moveRight();
  } else if (e.key === 'ArrowUp') {
    moved = game.moveUp();
  } else if (e.key === 'ArrowDown') {
    moved = game.moveDown();
  }

  if (moved) {
    e.preventDefault(); // Запобігаємо прокрутці екрану
    render();
  }
});

buttonEl.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  render();
});

render();
