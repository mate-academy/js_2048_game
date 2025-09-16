'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

function renderBoard(board) {
  // Знаходимо всі клітинки поля (16 елементів <td class="field-cell">)
  const cells = document.querySelectorAll('.field-cell');

  // Для кожної клітинки оновлюємо її вміст і клас
  cells.forEach((cell, idx) => {
    // Визначаємо рядок (0-3) для поточного індексу
    const row = Math.floor(idx / 4);
    // Визначаємо стовпець (0-3) для поточного індексу
    const col = idx % 4;
    // Отримуємо значення з масиву стану гри
    const value = board[row][col];

    // Встановлюємо текст клітинки (порожньо, якщо 0)
    cell.textContent = value !== 0 ? value : '';
    // Скидаємо всі попередні модифікатори кольору
    cell.className = 'field-cell';

    // Додаємо клас для кольору, якщо є значення
    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

const controls = document.querySelector('.controls');
const message = document.querySelector('.message');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const score = document.querySelector('.game-score');

controls.addEventListener('click', (e) => {
  const target = e.target;

  if (target.classList.contains('start')) {
    game.start();
    renderBoard(game.getState());
    target.classList.add('restart');
    target.classList.remove('start');
    target.textContent = 'Restart';
    messageStart.classList.add('hidden');
  }

  if (target.classList.contains('restart')) {
    game.restart();
    renderBoard(game.getState());
    score.textContent = 0;
    message.classList.add('hidden');
  }
});

window.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'lose' || game.getStatus() === 'win') {
    return;
  }

  if (e.key === 'ArrowLeft') {
    const prev = game.getState().map((row) => [...row]);

    game.moveLeft();
    renderBoard(game.getState());
    score.textContent = game.getScore();

    const current = game.getState();

    if (game.isBoardChanged(prev, current)) {
      game.addRandomCell();
      renderBoard(game.getState());
    }

    if (!game.hasAvailabelMoves()) {
      messageLose.classList.remove('hidden');
    }

    if (game.checkWin()) {
      messageWin.classList.remove('hidden');
    }
  }

  if (e.key === 'ArrowRight') {
    const prev = game.getState().map((row) => [...row]);

    game.moveRight();
    renderBoard(game.getState());
    score.textContent = game.getScore();

    const current = game.getState();

    if (game.isBoardChanged(prev, current)) {
      game.addRandomCell();
      renderBoard(game.getState());
    }

    if (!game.hasAvailabelMoves()) {
      messageLose.classList.remove('hidden');
    }

    if (game.checkWin()) {
      messageWin.classList.remove('hidden');
    }
  }

  if (e.key === 'ArrowUp') {
    const prev = game.getState().map((row) => [...row]);

    game.moveUp();
    renderBoard(game.getState());
    score.textContent = game.getScore();

    const current = game.getState();

    if (game.isBoardChanged(prev, current)) {
      game.addRandomCell();
      renderBoard(game.getState());
    }

    if (!game.hasAvailabelMoves()) {
      messageLose.classList.remove('hidden');
    }

    if (game.checkWin()) {
      messageWin.classList.remove('hidden');
    }
  }

  if (e.key === 'ArrowDown') {
    const prev = game.getState().map((row) => [...row]);

    game.moveDown();
    renderBoard(game.getState());
    score.textContent = game.getScore();

    const current = game.getState();

    if (game.isBoardChanged(prev, current)) {
      game.addRandomCell();
      renderBoard(game.getState());
    }

    if (!game.hasAvailabelMoves()) {
      messageLose.classList.remove('hidden');
    }

    if (game.checkWin()) {
      messageWin.classList.remove('hidden');
    }
  }
});
