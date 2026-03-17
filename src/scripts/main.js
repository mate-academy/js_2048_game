'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const startButton = document.querySelector('.start');
const scoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    // Старт гри
    game.start();
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  } else {
    // Рестарт гри
    game.restart();
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
  }

  renderBoard();
  renderScore();
  updateMessages();
});

document.addEventListener('keydown', (eve) => {
  switch (eve.key) {
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
  }
  renderBoard(); // оновлюємо поле після ходу
  renderScore();
  updateMessages();
});

function renderBoard() {
  const boardState = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  boardState.forEach((row, i) => {
    row.forEach((value, j) => {
      const index = i * 4 + j;

      cells[index].className = 'field-cell';

      if (value !== 0) {
        cells[index].classList.add(`field-cell--${value}`);
      }

      cells[index].textContent = value === 0 ? '' : value;
    });
  });
}

function renderScore() {
  scoreElement.textContent = game.getScore(); // беремо рахунок з класу Game
}

function updateMessages() {
  if (game.getStatus() === 'idle') {
    startMessage.classList.remove('hidden');
  } else {
    startMessage.classList.add('hidden'); // ховаємо після старту
  }

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  } else {
    winMessage.classList.add('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  } else {
    loseMessage.classList.add('hidden');
  }
}
