'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');

function updateField() {
  const cells = document.querySelectorAll('.field-cell');
  const state = game.getState();

  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[i].length; j++) {
      const cell = cells[i * game.size + j];

      cell.textContent = state[i][j] === 0 ? '' : state[i][j];
      cell.className = 'field-cell';

      if (state[i][j] !== 0) {
        cell.classList.add(`field-cell--${state[i][j]}`);
      }
    }
  }

  scoreEl.textContent = game.getScore();
  checkMessages();
}

function checkMessages() {
  winMsg.classList.toggle('hidden', game.getStatus() !== 'win');
  loseMsg.classList.toggle('hidden', game.getStatus() !== 'lose');
}

// Функція для запуску або перезапуску гри
function startOrRestartGame() {
  game.restart();
  game.start();
  game.addRandomTile();
  game.addRandomTile();
  updateField();

  const startMsg = document.querySelector('.message-start');

  startMsg.classList.add('hidden');

  // Після першого старту змінюємо клас кнопки на restart
  startBtn.textContent = 'Restart';
  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
}

startBtn.addEventListener('click', startOrRestartGame);

// керування стрілками
document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
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
    default:
      return;
  }

  updateField();
});
