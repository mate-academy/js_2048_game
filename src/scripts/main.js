'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('keydown', (event) => {
  switch (event.key) {
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
})

function updateUI() {
  const gameBoard = game.getState();
  const gameScore = game.getScore();
  const gameStatus = game.getStatus();

  const cells = document.querySelectorAll('.field-cell');
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = cells[i * 4 + j];
      cell.textContent = gameBoard[i][j] !== 0 ? gameBoard[i][j] : '';
      cell.className = 'field-cell';
      if (gameBoard[i][j] !== 0) {
        cell.classList.add(`field-cell--${gameBoard[i][j]}`);
      }
    }
  }

  document.querySelector('.game-score').textContent = gameScore;

  if (gameStatus === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

document.querySelector('.button.start').addEventListener('click', () => {
  if (game.getStatus() === 'playing') {
      game.restart();
  } else {
      game.start();
  }
  updateUI();
  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.button.start').textContent = 'Restart';
});
