'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
const Game = require('../modules/Game.class');
const game = new Game();

async function updateBoardUI(board) {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`; // Додати стилі
  });

  // Відобразити рахунок
  const scoreElement = document.querySelector('.game-score');

  scoreElement.textContent = game.getScore(); // Оновлення рахунку
}

// Button Start
const startButton = document.querySelector('.button.start');

startButton.addEventListener('click', () => {
  game.restart();
  updateBoardUI(game.getState());
  document.querySelector('.message-start').classList.remove('hidden');
  document.querySelector('.message-container .message').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');

  document.addEventListener('keydown', handleKeyDown);
});

// Оновлення після кожного руху
async function handleKeyDown(e) {
  game.move = true;

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      // move = true;
      break;
    case 'ArrowRight':
      game.moveRight();
      // move = true;
      break;
    case 'ArrowUp':
      game.moveUp();
      // move = true;
      break;
    case 'ArrowDown':
      game.moveDown();
      // move = true;
      break;
    default:
      return;
  }

  await updateBoardUI(game.getState());

  // Перевірити статус гри
  const gameStatus = game.getStatus();
  const start = document.querySelector('.message-start');

  // Змінна кнопки старт
  const buttonStart = document.querySelector('.start');

  if (game.getStatus() === 'playing' && game.move) {
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    buttonStart.textContent = 'Restart';
  }

  // Вивести відповідне повідомлення на основі статусу
  if (gameStatus === 'win') {
    start.classList.add('hidden');

    const win = document.querySelector('.message-win');

    win.classList.remove('hidden');
    document.removeEventListener('keydown', handleKeyDown);
  } else if (gameStatus === 'lose') {
    start.classList.add('hidden');

    const lose = document.querySelector('.message-lose');

    lose.classList.remove('hidden');
    document.removeEventListener('keydown', handleKeyDown);
  }

  // Оновити рахунок на екрані після кожного руху
  const scoreElement = document.querySelector('.score-value');

  scoreElement.textContent = game.getScore();
}

if (game.getStatus() === 'playing') {
  document.addEventListener('keydown', handleKeyDown);
}
