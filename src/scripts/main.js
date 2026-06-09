'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const board = game.getState();
  const score = game.getScore();

  scoreElement.textContent = score;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const index = r * 4 + c;

      const cell = cells[index];
      const value = board[r][c];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
      }
    }
  }

  const currentStatus = game.getStatus();

  if (currentStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (currentStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      render();
      break;
    case 'ArrowRight':
      game.moveRight();
      render();
      break;
    case 'ArrowUp':
      game.moveUp();
      render();
      break;
    case 'ArrowDown':
      game.moveDown();
      render();
      break;
  }
});

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  messageStart.classList.add('hidden');

  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');

  render();
});
