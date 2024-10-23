'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
document.addEventListener('keydown', handleKeydown);
document.querySelector('.start').addEventListener('click', startGame);

function startGame() {
  game.restart();
  renderBoard();
  updateScore();
  updateMessage('start');
  document.querySelector('.start').classList.remove('start');
  document.querySelector('.button').classList.add('restart');
  document.querySelector('.button').innerText = 'Restart';
}

// eslint-disable-next-line no-shadow
function handleKeydown(event) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (event.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
  }

  renderBoard();
  updateScore();

  if (game.getStatus() === 'win') {
    updateMessage('win');
  } else if (game.getStatus() === 'lose') {
    updateMessage('lose');
  }
}

function renderBoard() {
  const board = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.innerText = value === 0 ? '' : value;
    cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
  });
}

function updateScore() {
  document.querySelector('.game-score').innerText = game.getScore();
}

// eslint-disable-next-line no-shadow
function updateMessage(status) {
  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');

  if (status === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (status === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}
