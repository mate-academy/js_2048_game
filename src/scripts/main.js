'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const startButton = document.querySelector('.button.start');
const scoreDisplay = document.querySelector('.game-score');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
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
    }
    updateUI();
  }
});

function updateUI() {
  const gameBoard = game.getState();

  scoreDisplay.textContent = game.getScore();

  const cells = document.querySelectorAll('.field-cell');
  let cellIndex = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = gameBoard[row][col];
      const cell = cells[cellIndex];

      cell.className = 'field-cell';

      cell.textContent = value > 0 ? value : '';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
      }
      cellIndex++;
    }
  }

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    startButton.textContent = 'Restart';
  } else if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    startButton.textContent = 'Restart';
  }
}

startButton.addEventListener('click', () => {
  game.restart();
  updateUI();

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startButton.textContent = 'Restart';
  startButton.style.fontSize = '16px';
  startButton.classList.remove('start');
  startButton.classList.add('restart');

  startButton.blur();
});
