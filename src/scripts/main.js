'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameField = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const messageContainer = document.querySelector('.message-container');
const messageElements = {
  lose: document.querySelector('.message-lose'),
  win: document.querySelector('.message-win'),
  start: document.querySelector('.message-start'),
};

function updateUI() {
  const state = game.getState();
  const score = game.getScore();
  const currentStatus = game.getStatus();

  scoreElement.textContent = score;

  gameField.querySelectorAll('.field-row').forEach((row, rowIndex) => {
    row.querySelectorAll('.field-cell').forEach((cell, colIndex) => {
      cell.textContent = state[rowIndex][colIndex] || '';
      cell.className = `field-cell ${state[rowIndex][colIndex] ? `field-cell--${state[rowIndex][colIndex]}` : ''}`;
    });
  });

  messageContainer
    .querySelectorAll('.message')
    .forEach((message) => message.classList.add('hidden'));

  if (currentStatus === 'win') {
    messageElements.win.classList.remove('hidden');
  } else if (currentStatus === 'lose') {
    messageElements.lose.classList.remove('hidden');
  } else if (currentStatus === 'playing') {
    messageElements.start.classList.add('hidden');
  } else {
    messageElements.start.classList.remove('hidden');
  }
}

function handleKeyPress(evt) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (evt.key) {
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
  updateUI();
}

function startGame() {
  game.start();
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');

  updateUI(); // Оновлюємо інтерфейс після зміни статусу
}

function restartGame() {
  game.restart();
  startButton.textContent = 'Start';
  startButton.classList.remove('restart');
  startButton.classList.add('start');

  updateUI(); // Оновлюємо інтерфейс після скидання гри
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    startGame();
  } else {
    restartGame();
  }
});

document.addEventListener('keydown', handleKeyPress);

updateUI(); // Оновлюємо інтерфейс при завантаженні сторінки
