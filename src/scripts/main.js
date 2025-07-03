'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here
const cells = Array.from(document.querySelectorAll('.game-field .field-cell'));
const scoreElem = document.querySelector('.game-score');
const button = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

render();
updateStatus();

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'win' || game.getStatus() === 'lose') {
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
  updateStatus();
});

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  render();
  updateStatus();
});

function render() {
  const state = game.getState();

  // Оновлюємо кожну клітинку таблиці
  cells.forEach((cell, idx) => {
    const r = Math.floor(idx / game.size);
    const c = idx % game.size;
    const value = state[r][c];

    cell.textContent = value === 0 ? '' : value;

    // Очищаємо всі класи field-cell--*
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  // Оновлюємо рахунок
  scoreElem.textContent = game.getScore();
}

function updateStatus() {
  const gameStatus = game.getStatus();

  // Ховаємо всі повідомлення
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  } else if (gameStatus === 'playing') {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }
}
