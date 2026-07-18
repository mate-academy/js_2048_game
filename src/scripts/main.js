'use strict';

import Game from '../modules/Game.class';

const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

const game = new Game();

function updateUI() {
  const board = game.getState();

  scoreElement.textContent = game.getScore();

  let cellIndex = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = board[r][c];
      const cell = cells[cellIndex];

      // Записываем цифру (или очищаем, если 0)
      cell.textContent = value === 0 ? '' : value;

      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`tile-${value}`);
      }

      cellIndex++;
    }
  }

  // const status = game.getStatus();

  msgStart.classList.add('hidden');
  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');

  if (status === 'win') {
    msgWin.classList.remove('hidden');
  } else if (status === 'lose') {
    msgLose.classList.remove('hidden');
  } else if (status === 'idle') {
    msgStart.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  const currentStatus = game.getStatus();

  if (currentStatus === 'idle') {
    game.start();
    startButton.textContent = 'Restart'; // Меняем текст кнопки
  } else {
    game.restart();
  }

  updateUI();
});

window.addEventListener('keydown', (ev) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (ev.key) {
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

  event.preventDefault();

  updateUI();
});
