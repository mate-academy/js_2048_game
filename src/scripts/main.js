'use strict';
import Game from '../modules/Game.class.js';

const game = new Game();
const scoreElement = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const messegeInfo = document.querySelector('.message');

function updateBoard() {
  const cells = document.querySelectorAll('.field-cell');
  const board = game.getState();

  let has2048 = false;

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell field-cell--${value}`;

    if (value === 2048) {
      has2048 = true;
    }
  });

  if (has2048) {
    messegeInfo.classList.remove('message-start');
    messegeInfo.textContent = 'Winner! Congrats! You did it!';
    messegeInfo.className = 'message message-win';
  }
}

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startBtn.textContent = 'restart';
    startBtn.classList.add('restart');
  } else {
    game.restart();
    scoreElement.textContent = '0';
  }

  updateBoard();

  messegeInfo.textContent = '';
  messegeInfo.className = 'message hidden';
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let newScore = 0;

  switch (e.key) {
    case 'ArrowUp':
      newScore = game.moveUp();
      break;
    case 'ArrowDown':
      newScore = game.moveDown();
      break;
    case 'ArrowLeft':
      newScore = game.moveLeft();
      break;
    case 'ArrowRight':
      newScore = game.moveRight();
      break;
    default:
      return;
  }
  scoreElement.textContent = newScore;
  updateBoard();

  if (game.isGameOver()) {
    messegeInfo.textContent = 'You lose! Restart the game?';
    messegeInfo.className = 'message message-lose';
    game.status = 'lost';
  }
});
