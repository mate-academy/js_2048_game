'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function updateUI() {
  const board = game.getState();
  const score = game.getScore();
  const statusGame = game.getStatus();

  document.querySelector('.game-score').textContent = score;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = document.querySelector(
        `.field-row:nth-child(${row + 1}) .field-cell:nth-child(${col + 1})`,
      );

      cell.textContent = board[row][col] === 0 ? '' : board[row][col];
      cell.className = `field-cell field-cell--${board[row][col]}`;
    }
  }

  if (statusGame === 'playing') {
    startMessage.classList.add('hidden');
  } else if (statusGame === 'win') {
    winMessage.classList.remove('hidden');

    document.querySelector('.restart').addEventListener('click', () => {
      winMessage.classList.add('hidden');
    });
  } else if (statusGame === 'lose') {
    loseMessage.classList.remove('hidden');

    document.querySelector('.restart').addEventListener('click', () => {
      loseMessage.classList.add('hidden');
    });
  } else {
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }
}

startBtn.addEventListener('click', () => {
  game.start();
  updateUI();
  startBtn.textContent = 'Restart';
  startBtn.classList.add('restart');
  startBtn.classList.remove('start');
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
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
  }

  updateUI();
});
