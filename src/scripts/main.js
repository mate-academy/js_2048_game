'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('keydown', (evnt) => {
  switch (evnt.key) {
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
});

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
  } else if (gameStatus === 'idle') {
    document.querySelector('.message-start').classList.remove('hidden');
  }
}

updateUI();

document.querySelector('.button.start').addEventListener('click', () => {
  const startBtn = document.querySelector('.button.start');

  if (
    game.getStatus() === 'playing' ||
    game.getStatus() === 'lose' ||
    game.getStatus() === 'win'
  ) {
    game.restart();
    startBtn.textContent = 'Start';
    startBtn.classList.remove('restart');

    document.querySelector('.message-lose').classList.add('hidden');
    document.querySelector('.message-win').classList.add('hidden');
  } else {
    game.start();
    startBtn.textContent = 'Restart';
    startBtn.classList.add('restart');
    document.querySelector('.message-start').classList.add('hidden');
  }

  updateUI();
});
