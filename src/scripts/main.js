'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');

function updateUI() {
  const state = game.getState();

  state.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value === 0 ? '' : value; // Показуємо плитку, якщо не 0
    cell.className = `field-cell field-cell--${value}`; // Додаємо відповідний клас для стилів
  });

  scoreElement.textContent = game.getScore(); // Оновлюємо рахунок

  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden'); // Виграли
    loseMessage.classList.add('hidden');
  } else if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden'); // Програли
    winMessage.classList.add('hidden');
  } else {
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }
}

startButton.addEventListener('click', () => {
  game.restart();
  updateUI();

  startButton.textContent = 'Restart';
  startMessage.classList.add('hidden');

  startButton.classList.add('restart');
  startButton.classList.remove('hidden');
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.move('left');
      break;
    case 'ArrowRight':
      game.move('right');
      break;
    case 'ArrowUp':
      game.move('up');
      break;
    case 'ArrowDown':
      game.move('down');
      break;
  }
  updateUI(); // Оновлюємо UI після кожного ходу
});
