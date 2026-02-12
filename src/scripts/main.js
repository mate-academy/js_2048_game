'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const boardEl = document.querySelector('.game-field');
const scoreEl = document.querySelector('.game-score');

// ✅ ВИПРАВЛЕНО ТУТ
const startBtn = document.querySelector('.button.start');

const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');
const msgStart = document.querySelector('.message-start');

function render() {
  // рахунок
  scoreEl.textContent = game.getScore();

  // плитки
  const cells = boardEl.querySelectorAll('.field-cell');
  const flatBoard = game.getState().flat();

  cells.forEach((cell, i) => {
    const value = flatBoard[i];

    cell.textContent = value !== 0 ? value : '';
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  // повідомлення
  const gameStatus = game.getStatus();

  msgWin.classList.add('hidden');
  msgLose.classList.add('hidden');
  msgStart.classList.add('hidden');

  if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
  }

  if (gameStatus === 'idle') {
    msgStart.classList.remove('hidden');
  }
}

// кнопка Start / Restart
startBtn.addEventListener('click', () => {
  game.restart();
  render();

  startBtn.textContent = 'Restart';
  startBtn.style.fontSize = '18px';
  startBtn.style.backgroundColor = 'red';
  startBtn.style.color = 'white';
  startBtn.classList.add('restart');
});

// клавіші
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

  render();
});
