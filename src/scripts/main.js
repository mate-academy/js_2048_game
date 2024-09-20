'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();
const score = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');

// Додаємо обробники подій
attachEventListeners();

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'Playing') {
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

  updateGameUI();
});

function updateGameUI() {
  const boardState = game.getState();
  const currentScore = game.getScore();
  const gameStatus = game.getStatus();

  // Оновлення клітинок гри
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = boardState[row][col];

    cell.textContent = value || '';
    cell.className = `field-cell ${value ? 'field-cell--' + value : 'field-cell--empty'}`;
  });

  score.textContent = currentScore;

  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');
  const startMessage = document.querySelector('.message-start');

  if (gameStatus === 'Won') {
    winMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    startMessage.classList.add('hidden');
  } else if (gameStatus === 'Game Over') {
    loseMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    startMessage.classList.add('hidden');
  } else {
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    startMessage.classList.add('hidden');
  }
}

function startGame() {
  game.restart();
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  document.querySelector('.message-start').classList.add('hidden');
  updateGameUI();
}

function restartGame() {
  game.restart();
  updateGameUI();
}

function attachEventListeners() {
  if (startButton) {
    startButton.addEventListener('click', startGame);
  }

  if (restartButton) {
    restartButton.addEventListener('click', restartGame);
  }
}

updateGameUI();
