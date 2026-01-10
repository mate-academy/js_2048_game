/* global Game */
'use strict';

// Створюємо гру та передаємо функції, які будуть викликатися автоматично
const game = new Game(
  () => renderScore(),
  () => renderStatus(),
);

function renderBoard() {
  const cells = document.querySelectorAll('.field-cell');
  const boardData = game.getState().flat();

  cells.forEach((cell, i) => {
    cell.innerHTML = '';

    const val = boardData[i];

    if (val > 0) {
      const tile = document.createElement('div');

      tile.className = `tile tile-${val}`;
      tile.textContent = val;
      cell.appendChild(tile);
    }
  });
}

function renderScore() {
  const el = document.querySelector('.game-score');

  if (el) {
    el.textContent = game.getScore();
  }
}

function renderStatus() {
  const lose = document.querySelector('.message-lose');
  const win = document.querySelector('.message-win');
  const start = document.querySelector('.message-start');
  const currentGameStatus = game.getStatus();

  if (lose) {
    lose.classList.toggle('hidden', currentGameStatus !== 'lose');
  }

  if (win) {
    win.classList.toggle('hidden', currentGameStatus !== 'win');
  }

  if (start) {
    start.classList.toggle('hidden', currentGameStatus !== 'idle');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  renderBoard();
});

document.querySelector('.button.start')?.addEventListener('click', () => {
  game.start();
  renderBoard();
});

document.querySelector('.button.restart')?.addEventListener('click', () => {
  game.restart();
  renderBoard();
});

// Початкове відображення
renderBoard();
renderScore();
renderStatus();
