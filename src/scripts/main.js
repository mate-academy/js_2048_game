'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

document.addEventListener('keydown', (evnt) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (evnt.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    default:
      return;
  }

  if (moved) {
    game.addRandomTile();
  }

  game.checkGameOver();
  updateUI();
});

function updateUI() {
  const cells = document.querySelectorAll('.field-cell');
  let index = 0;

  game.getState().forEach((row) => {
    row.forEach((cell) => {
      const cellElement = cells[index++];

      cellElement.textContent = cell !== 0 ? cell : '';
      cellElement.className = 'field-cell';

      if (cell !== 0) {
        cellElement.classList.add(`field-cell--${cell}`);
      }
    });
  });

  document.querySelector('.game-score').textContent = game.getScore();

  const gameStatus = game.getStatus();
  const startButton = document.querySelector('.start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');
  const startMessage = document.querySelector('.message-start');

  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
  startMessage.classList.toggle('hidden', gameStatus !== 'idle');

  startButton.textContent = gameStatus === 'idle' ? 'Start' : 'Restart';
}

document.querySelector('.start').addEventListener('click', () => {
  game.start();
  updateUI();
});
