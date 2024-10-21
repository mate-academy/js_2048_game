'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
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
  const scoreDisplay = document.querySelector('.game-score');

  scoreDisplay.textContent = game.getScore();

  const cells = document.querySelectorAll('.field-cell');
  let cellIndex = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = gameBoard[row][col];
      const cell = cells[cellIndex];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
      cellIndex++;
    }
  }

  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

document.querySelector('.button.start').addEventListener('click', () => {
  if (game.getStatus() === 'idle' || game.getStatus() !== 'playing') {
    game.restart();
    updateUI();
    document.querySelector('.message-start').classList.add('hidden');
    document.querySelector('.button.start').classList.add('restart');
  }
});
